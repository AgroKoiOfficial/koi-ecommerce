import { prisma } from "@/prisma/prisma";
import { sendPaymentConfirmationEmail } from "@/utils/sendPaymentConfirmation.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metode tidak diizinkan" });
  }

  const xenditWebhookSecret = process.env.XENDIT_WEBHOOK_TOKEN;
  const sig = req.headers['x-callback-token'];

  if (sig !== xenditWebhookSecret) {
    return res.status(401).json({ message: "Tidak diizinkan" });
  }

  /**
   * The external_id, status, and paid_amount fields from the Xendit payment gateway.
   *
   * @type {string}
   */

  const { external_id, status, paid_amount } = req.body;

  if (!external_id) {
    console.error("external_id tidak ditemukan dalam request body.");
    return res.status(400).json({ message: "external_id tidak ditemukan" });
  }

  try {
    const existingCheckout = await prisma.checkout.findUnique({
      where: { id: external_id },
    });

    if (!existingCheckout) {
      console.error("Checkout record tidak ditemukan untuk id:", external_id);
      return res.status(404).json({ message: "Checkout record tidak ditemukan" });
    }

    // Update the checkout status
    let updatedStatus;
    switch (status) {
      case "PAID":
        updatedStatus = "PAID";
        break;
      case "EXPIRED":
        updatedStatus = "EXPIRED";
        break;
      default:
        updatedStatus = "UNPAID";
    }

    if (status === "EXPIRED") {
      const cartItems = existingCheckout.cart; 
      for (const cartItem of cartItems) {
        await prisma.product.update({
          where: { id: cartItem.product.id },
          data: { stock: { increment: cartItem.quantity } },
        });
      }
    }

    const updatedCheckout = await prisma.checkout.update({
      where: { id: external_id },
      data: {
        status: updatedStatus,
        total: paid_amount,
      },
    });

    if (status === "PAID") {
      const user = await prisma.user.findUnique({
        where: { id: updatedCheckout.userId },
        select: { email: true },
      });

      if (user) {
        await sendPaymentConfirmationEmail(user.email, updatedCheckout);
      }
    }

    return res.status(200).json({ message: "Webhook diterima" });
  } catch (error) {
    console.error("Kesalahan saat memperbarui status pembayaran:", error.message);
    return res.status(500).json({ message: "Gagal memperbarui status pembayaran", error: error.message });
  }
}

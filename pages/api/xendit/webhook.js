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

      // Process cart items if `cart` is a JSON field
      if (existingCheckout.cart) {
        try {
          const cartItems = JSON.parse(existingCheckout.cart);

          for (const cartItem of cartItems) {
            const product = await prisma.product.findUnique({
              where: { id: cartItem.product.id },
            });

            if (!product) {
              console.error("Produk tidak ditemukan untuk id:", cartItem.product.id);
              continue;
            }

            await prisma.product.update({
              where: { id: cartItem.product.id },
              data: { stock: { decrement: cartItem.quantity } },
            });
          }

          // Clear cart data after processing
          await prisma.checkout.update({
            where: { id: external_id },
            data: { cart: null }, // Clear cart field after processing
          });

        } catch (error) {
          console.error("Kesalahan saat memproses item keranjang:", error.message);
        }
      }
    }

    return res.status(200).json({ message: "Webhook diterima" });
  } catch (error) {
    console.error("Kesalahan saat memperbarui status pembayaran:", error.message);
    return res.status(500).json({ message: "Gagal memperbarui status pembayaran", error: error.message });
  }
}

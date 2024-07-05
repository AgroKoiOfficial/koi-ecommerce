import Midtrans from "midtrans-client";
import { prisma } from "@/prisma/prisma";

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { order_id, transaction_status } = req.body;

  try {
    const checkout = await prisma.checkout.findUnique({
      where: { id: order_id },
    });

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (transaction_status === "settlement" || transaction_status === "capture") {
      await prisma.checkout.update({
        where: { id: order_id },
        data: { status: "PAID" },
      });
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      await prisma.checkout.update({
        where: { id: order_id },
        data: { status: "FAILED" },
      });
    }

    res.status(200).json({ message: "Payment status updated" });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

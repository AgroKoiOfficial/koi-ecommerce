import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metode tidak diizinkan" });
  }

  try {
    const expiredCheckouts = await prisma.checkout.findMany({
      where: {
        status: "UNPAID",
        updatedAt: {
          lt: new Date(new Date().getTime() - 6 * 60 * 60 * 1000),
        },
      },
    });

    for (const checkout of expiredCheckouts) {
      const cart = checkout.cart;

      // Kembalikan stok produk
      for (const item of cart) {
        const productId = item.product.id;
        const quantity = item.quantity;

        await prisma.product.update({
          where: { id: productId },
          data: { stock: { increment: quantity } },
        });
      }

      await prisma.checkout.update({
        where: { id: checkout.id },
        data: { status: "EXPIRED" },
      });
    }

    res
      .status(200)
      .json({
        message:
          "Stok produk berhasil dikembalikan untuk checkout yang expired",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Gagal mengembalikan stok produk",
        error: error.message,
      });
  }
}

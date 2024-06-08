import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { id } = req.query;
    const { quantity } = req.body;

    const existingCartItem = await prisma.cart.findUnique({
      where: {
        id,
      },
    });

    if (!existingCartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const product = await prisma.product.findUnique({
      where: { id: existingCartItem.productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (parseInt(quantity) === 0) {
      await prisma.cart.delete({
        where: { id },
      });
      return res.status(200).json({ message: "Product removed from cart" });
    }

    if (product.stock === 1) {
      return res.status(400).json({
        error: "Product is reserved and cannot be updated due to low stock",
      });
    }

    const parsedQuantity = parseInt(quantity);

    await prisma.cart.update({
      where: { id },
      data: {
        quantity: parsedQuantity,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

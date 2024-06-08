import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { userId, productId, total, quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    if (product.quantity === 1) {
      const existingCartItem = await prisma.cart.findFirst({
        where: { productId },
      });

      if (existingCartItem && existingCartItem.userId !== userId) {
        return res
          .status(400)
          .json({ error: "Product is reserved by another user" });
      }
    }

    const userCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (userCartItem) {
      const updatedCartItem = await prisma.cart.update({
        where: {
          id: userCartItem.id,
        },
        data: {
          total: userCartItem.total + total,
          quantity: userCartItem.quantity + quantity,
          updatedAt: new Date(),
        },
      });
      return res.status(200).json(updatedCartItem);
    }

    const cart = await prisma.cart.create({
      data: {
        userId,
        productId,
        total,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart. Please try again later." });
  }
}

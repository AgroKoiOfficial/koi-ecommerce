import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (token.role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const carts = await prisma.cart.findMany({
      select: {
        id: true,
        total: true,
        quantity: true,
        user: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
            image: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

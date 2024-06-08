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

  try {
    const { id } = req.query;

    const cart = await prisma.cart.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        total: true,
        quantity: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      include: {
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

    res.status(200).json(cart);
  } catch (error) {
    throw new Error(error);
  }
}

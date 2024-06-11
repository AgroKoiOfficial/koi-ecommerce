import { prisma } from "@/prisma/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    const checkout = await prisma.checkout.findUnique({
      where: {
        id: id,
      },
      include: {
        cart: true,
        address: true,
        shipping: true,
        coupon: true,
      },
    });

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    return res.status(200).json({ checkout });
  } catch (error) {
    console.error("Error getting checkout:", error);
    return res.status(500).json({ message: "Failed to get checkout" });
  }
}

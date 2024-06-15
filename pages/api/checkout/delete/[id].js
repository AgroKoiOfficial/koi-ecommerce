import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;
  try {
    const checkout = await prisma.checkout.delete({
      where: {
        id,
      },
    });
    return res.status(200).json(checkout);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}


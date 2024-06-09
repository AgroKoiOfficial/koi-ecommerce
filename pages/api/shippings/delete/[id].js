import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { id } = req.query;

    const shipping = await prisma.shipping.delete({
      where: {
        id,
      },
    });

    return res.status(200).json(shipping);
  } catch (error) {
    console.error("Error deleting shipping:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

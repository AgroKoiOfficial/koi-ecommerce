import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const categoryId = req.query.id;

  if (req.method !== "DELETE") {
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
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

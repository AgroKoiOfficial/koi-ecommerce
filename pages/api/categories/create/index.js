import { getToken } from "next-auth/jwt";
import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

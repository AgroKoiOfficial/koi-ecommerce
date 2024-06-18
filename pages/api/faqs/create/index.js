import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); 
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { slug, question, category, answer } = req.body;

  try {
    const newFaq = await prisma.fAQ.create({
      data: {
        slug,
        question,
        category,
        answer,
      },
    });

    return res.status(200).json(newFaq);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import validator from "validator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sanitizedComment = validator.escape(req.body.comment);

  try {
    const { userId, productId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment: sanitizedComment,
      },
    });

    res.status(200).json(review);
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
}

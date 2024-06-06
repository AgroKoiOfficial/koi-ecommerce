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

  try {
    const { id } = req.query;
    const review = await prisma.review.delete({
      where: {
        id,
      },
    });

    res.status(200).json(review);
  } catch (error) {
    console.error("Failed to delete review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
}

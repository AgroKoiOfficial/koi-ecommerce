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
    console.log("Request Query:", req.query); 
    const { getUserId } = req.query; 
    if (!getUserId) {
      return res.status(400).json({ error: "getUserId parameter is required" });
    }

    const review = await prisma.review.findMany({
      where: {
        userId: getUserId,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        user: { select: { name: true } },
        product: { select: {id: true, name: true, image: true } },
      },
    });

    if (review.length === 0) {
      return res
        .status(404)
        .json({ error: "No reviews found for the given userId" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Failed to fetch review:", error);
    res.status(500).json({ error: "Failed to fetch review" });
  }
}

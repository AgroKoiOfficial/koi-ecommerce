import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const reviews = await prisma.review.findMany({
      include: {
        user : {
          select: {
            name: true
          }
        }
      }
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

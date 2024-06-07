import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let where = {};
      if (search) {
        where = {
          OR: [
            { comment: { contains: search } },
            { user: { name: { contains: search } } },
            { product: { name: { contains: search } } },
          ],
        };
      }

      const totalReviews = await prisma.review.count({ where });
      const reviews = await prisma.review.findMany({
        where,
        select: {
          id: true,
          rating: true,
          comment: true,
          user: { select: { name: true } },
          product: { select: { name: true, image: true } }
        },
        skip: offset,
        take: parseInt(limit),
      });      

      const reviewsWithoutIds = reviews.map((review) => {
        const { productId, userId, ...reviewWithoutIds } = review;
        return reviewWithoutIds;
      });

      res.setHeader("X-Total-Count", totalReviews);
      res.status(200).json(reviewsWithoutIds);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

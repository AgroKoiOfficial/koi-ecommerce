import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { productId } = req.query;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (reviews.length === 0) {
      return res.status(200).json({ message: "No reviews found for this product" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(200).json({ message: "Error fetching reviews" });
  }
}

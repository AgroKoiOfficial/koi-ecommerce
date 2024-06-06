import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { id } = req.query;

  try {
    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(review);
  } catch (error) {
    console.error("Failed to fetch review:", error);
    res.status(500).json({ error: "Failed to fetch review" });
  }
}

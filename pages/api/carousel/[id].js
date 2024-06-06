import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const carouselId = req.query.id;

    const carousel = await prisma.carousel.findUnique({
      where: { id: carouselId },
    });

    if (!carousel) {
      return res.status(404).json({ error: "Carousel not found" });
    }

    const carouselWithUrl = {
      ...carousel,
      image: carousel.image ? `/carousels/${carousel.image}` : null,
    };

    res.status(200).json(carouselWithUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch carousel" });
  }
}

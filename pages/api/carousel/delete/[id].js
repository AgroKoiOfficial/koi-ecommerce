import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { id: carouselId } = req.query;

    if (!carouselId) {
      return res.status(400).json({ error: "Carousel ID is required" });
    }

    const carousel = await prisma.carousel.findUnique({
      where: { id: carouselId },
    });

    if (!carousel) {
      return res.status(404).json({ error: "Carousel not found" });
    }

    if (carousel.image) {
      const imagePath = `./public${carousel.image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.carousel.delete({ where: { id: carouselId } });

    res.status(200).json({ message: "Carousel deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete carousel", details: error.message });
  }
}

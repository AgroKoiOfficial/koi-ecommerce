import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const carousels = await prisma.carousel.findMany({
            select : {
                id: true,
                title: true,
                image: true
            }
        });
        const carouselWithUrl = carousels.map((carousel) => {
            return {
                ...carousel,
                image: carousel.image ? `${carousel.image}` : null,
            };
        })

        return res.status(200).json(carouselWithUrl);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
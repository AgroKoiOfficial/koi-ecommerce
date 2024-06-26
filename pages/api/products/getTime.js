import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const latestProducts = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 8,
        });

        return res.status(200).json({
            latestProducts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

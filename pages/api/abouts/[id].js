import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const aboutId = req.query.id;

        const about = await prisma.about.findUnique({
            where: { id: aboutId },
        });

        if (!about) {
            return res.status(404).json({ error: "About not found" });
        }

        const aboutWithUrl = {
            ...about,
            image: about.image ? `/about/${about.image}` : null,
        };

        res.status(200).json(aboutWithUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch about" });
    }
}

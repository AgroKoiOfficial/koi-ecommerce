import { prisma } from "@/prisma/prisma";

export default async function handler (req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const abouts = await prisma.about.findMany();
        const formattedAbouts = abouts.map((about) => {
            return {
                ...about,
                image: about.image ? `${about.image}` : null,
            };
        })

        return res.status(200).json(formattedAbouts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
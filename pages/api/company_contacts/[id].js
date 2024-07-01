import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const aboutId = req.query.id;
        const contacts = await prisma.companyContact.findMany({
            where: {
                aboutId,
            },
        });
        res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const terms = await prisma.terms.findUnique({
                where: { id: req.query.id },
            });
            res.status(200).json({ terms });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch terms" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
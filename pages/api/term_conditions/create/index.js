import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).end();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if(!token || token.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, content } = req.body;

    if(!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    try {
        const termCondition = await prisma.termCondition.create({
            data: {
                title,
                content
            }
        });

        res.status(200).json(termCondition);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

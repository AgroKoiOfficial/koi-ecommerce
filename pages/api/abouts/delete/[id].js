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
        const { id: aboutId } = req.query;

        if (!aboutId) {
            return res.status(400).json({ error: "About ID is required" });
        }

        const about = await prisma.about.findUnique({
            where: { id: aboutId },
        });

        if (!about) {
            return res.status(404).json({ error: "About not found" });
        }

        if (about.image) {
            const imagePath = `./public${about.image}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.about.delete({ where: { id: aboutId } });

        res.status(200).json({ message: "About deleted successfully" });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Failed to delete about", details: error.message });
    }
}

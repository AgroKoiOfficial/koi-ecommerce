import {prisma} from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).end();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const deletedService = await prisma.service.delete({
            where: {
                id: req.query.id,
            },
        });

        return res.status(200).json(deletedService);
    } catch (error) {
        console.error("Error deleting customer service:", error);
        return res
            .status(500)
            .json({ error: "Failed to delete customer service" });
    }
}

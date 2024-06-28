import {prisma} from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(405).end();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const service = await prisma.service.update({
            where: {
                id: req.query.id
            },
            data: req.body
        });

        return res.status(200).json(service);
    } catch (error) {
        console.error("Error updating customer service:", error);
        return res.status(500).json({ message: "Failed to update customer service" });
    }
}

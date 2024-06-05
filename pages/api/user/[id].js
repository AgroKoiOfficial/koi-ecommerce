import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if(!token) {
            return res.status(401).json({error: "Unauthorized"});
        }

        const { id } = req.query;

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({error: "Internal server error"});
    }
}

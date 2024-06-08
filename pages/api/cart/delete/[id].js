import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).end();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { id } = req.query;
        const deletedCartItem = await prisma.cart.delete({
            where: {
                id,
            },
        });
        res.status(200).json(deletedCartItem);
    } catch (error) {
        throw new Error(error);
    }
}

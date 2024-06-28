import {prisma} from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    const service = await prisma.service.findUnique({
        where: {
            id: req.query.id,
        },
    });

    return res.status(200).json(service);
}
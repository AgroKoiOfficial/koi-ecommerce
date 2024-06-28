import {prisma} from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const services = await prisma.service.findMany();
        res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
        return res.status(200).json(services);
    } catch (error) {
        console.error("Error fetching customer services:", error);
        return res.status(500).json({ message: "Failed to fetch customer services" });
    }
}


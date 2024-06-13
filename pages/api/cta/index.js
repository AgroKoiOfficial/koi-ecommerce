import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const services = await prisma.customerService.findMany();
    return res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching customer services:", error);
    return res.status(500).json({ message: "Failed to fetch customer services" });
  }
}
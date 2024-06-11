import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const regions = await prisma.shipping.findMany({
      select: {
        region: true,
      },
      distinct: ['region'],
    });

    res.status(200).json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

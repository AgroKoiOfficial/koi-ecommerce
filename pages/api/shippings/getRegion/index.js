import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const { region } = req.query;

    const shippings = await prisma.shipping.findMany({
      where: {
        region: {
          equals: region,
        },
      },
    });

    res.status(200).json(shippings);
  } catch (error) {
    console.error('Error fetching shippings:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

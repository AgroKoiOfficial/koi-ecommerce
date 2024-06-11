import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const { region, city } = req.query;

    const shippingOptions = await prisma.shipping.findMany({
      where: {
        region: {
          equals: region,
        },
        city: {
          equals: city,
        },
      },
    });

    res.status(200).json(shippingOptions);
  } catch (error) {
    console.error('Error fetching shipping options:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let where = {};
      if (search) {
        where = {
          OR: [
            { city: { contains: search } },
            { region: { contains: search } },
          ],
        };
      }

      const totalShippings = await prisma.shipping.count({ where });
      const shippings = await prisma.shipping.findMany({
        where,
        skip: offset,
        take: parseInt(limit),
      });

      res.setHeader("X-Total-Count", totalShippings);
      res.status(200).json(shippings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch shippings" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

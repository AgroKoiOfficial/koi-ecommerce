import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let where = {};
      if (search) {
        where = {
          name: {
            contains: search
          }
        };
      }

      const totalCategories = await prisma.category.count({ where });
      const categories = await prisma.category.findMany({
        where,
        skip: offset,
        take: parseInt(limit),
      });

      res.setHeader("X-Total-Count", totalCategories);
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }
  
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      const categories = await prisma.category.findMany({
        skip: offset,
        take: limit,
      });
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
}

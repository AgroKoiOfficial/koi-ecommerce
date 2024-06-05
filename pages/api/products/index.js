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

      const totalProducts = await prisma.product.count({ where });
      const products = await prisma.product.findMany({
        where,
        include: { category: true },
        skip: offset,
        take: parseInt(limit),
      });

      const productsWithUrl = products.map((product) => {
        return {
          ...product,
          image: product.image ? `${product.image}` : null,
          video: product.video ? `${product.video}` : null,
          category: product.category.name,
        };
      });

      res.setHeader("X-Total-Count", totalProducts);
      res.status(200).json(productsWithUrl);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

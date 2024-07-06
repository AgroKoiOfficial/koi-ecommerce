import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { search = '', category = '' } = req.query;

      let where = {};
      if (search) {
        where.name = { contains: search };
      }

      if (category) {
        where.category = { name: category };
      }

      const categoriesWithProducts = await prisma.category.findMany({
        where: {
          products: {
            some: {
              AND: [
                where.name ? { name: { contains: search } } : {},
                where.category ? { category: { name: category } } : {}
              ]
            }
          }
        }
      });

      const products = await prisma.product.findMany({
        where,
        include: { category: true }
      });

      const productsWithUrl = products.map((product) => {
        return {
          ...product,
          image: product.image ? `${product.image}` : null,
          video: product.video ? `${product.video}` : null,
          category: product.category.name,
        };
      });

      const displayedCategories = categoriesWithProducts.map((cat) => cat.name);

      res.status(200).json({ productsWithUrl, displayedCategories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

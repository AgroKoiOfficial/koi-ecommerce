import prisma from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const productId = req.query.id;

      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productWithUrl = {
        ...product,
        image: product.image ? `/images/${product.image}` : null,
        video: product.video ? `/videos/${product.video}` : null,
        category: product.category.name,
      };

      res.status(200).json(productWithUrl);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

import {prisma} from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Missing product ID" });
      }

      const product = await prisma.product.findUnique({
        where: { id: id },
        include: { category: true },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productWithUrl = {
        ...product,
        image: product.image ? `${product.image}` : null,
        video: product.video ? `${product.video}` : null,
        category: product.category.name,
      };

      res.status(200).json(productWithUrl);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

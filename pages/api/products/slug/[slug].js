import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { slug } = req.query;

  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
      },
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
    console.error("Error fetching product:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

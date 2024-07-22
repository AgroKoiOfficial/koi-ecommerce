import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    const { productId } = req.query;

    if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
    }

    try {
        const currentProduct = await prisma.product.findUnique({
            where: { id: productId },
            select: { categoryId: true },
        });

        if (!currentProduct) {
            return res.status(404).json({ error: "Product not found" });
        }


        const relatedProducts = await prisma.product.findMany({
            where: { categoryId: currentProduct.categoryId, id: { not: productId } },
            take: 5,
        });

        if (relatedProducts.length === 0) {
            return res.status(404).json({ message: "No related products found" });
        }

        const productsWithUrl = relatedProducts.map((product) => {
            return {
                ...product,
                image: product.image ? `${product.image}` : null,
                video: product.video ? `${product.video}` : null,
            };
        });

        res.status(200).json(productsWithUrl);
    } catch (error) {
        console.error("Failed to fetch related products:", error);
        res.status(500).json({ error: "Failed to fetch related products" });
    }
}

import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  const categoryId = req.query.id;

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

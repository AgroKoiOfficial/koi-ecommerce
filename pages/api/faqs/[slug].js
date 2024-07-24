import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { slug } = req.query;

  try {
    const faq = await prisma.fAQ.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        slug: true,
        question: true,
        answer: true,
        category: true,
      },
    });

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json(faq);
  } catch (error) {
    console.error("Error fetching FAQ:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
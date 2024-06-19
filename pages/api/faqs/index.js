import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let where = {
        OR: [
          {
            question: {
              contains: search,
            },
          },
          {
            category: {
              contains: search,
            },
          },
          {
            answer: {
              contains: search,
            },
          },
        ],
      };

      const totalFaqs = await prisma.fAQ.count({ where });
      const faqs = await prisma.fAQ.findMany({
        where,
        skip: offset,
        take: parseInt(limit),
        select: {
          id: true,
          slug: true,
          question: true,
          answer: true,
          category: true,
        },
      });

      res.setHeader("X-Total-Count", totalFaqs.toString());
      res.status(200).json(faqs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

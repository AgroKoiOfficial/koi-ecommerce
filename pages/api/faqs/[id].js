import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).end();
  }

  const { id } = req.query;

  try {
    const faq = await prisma.fAQ.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(faq);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

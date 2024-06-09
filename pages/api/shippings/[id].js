import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const shipping = await prisma.shipping.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(shipping);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

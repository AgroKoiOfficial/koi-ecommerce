import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { id } = req.query;

    const { city, region, fee } = req.body;

    const parsedFee = parseInt(fee, 10);

    const shipping = await prisma.shipping.update({
      where: {
        id,
      },
      data: {
        city,
        region,
        fee: parsedFee,
      },
    });

    return res.status(200).json(shipping);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

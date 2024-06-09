import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
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
    const { city, region, fee } = req.body;
    
    // Ensure fee is parsed as a number
    const parsedFee = parseFloat(fee);
    if (isNaN(parsedFee)) {
      return res.status(400).json({ error: "Invalid fee format" });
    }

    const shipping = await prisma.shipping.create({
      data: {
        city,
        region,
        fee: parsedFee,
      },
    });

    return res.status(201).json(shipping);
  } catch (error) {
    console.error("Error creating shipping:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

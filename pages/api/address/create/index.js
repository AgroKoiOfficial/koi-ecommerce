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

  const {phone, city, postalCode, province, street, userId } = req.body;
  try {
    const address = await prisma.address.create({
      data: {
        phone,
        city,
        postalCode,
        province,
        street,
        userId,
      },
    });
    console.log(address);
    res.status(201).json(address);
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

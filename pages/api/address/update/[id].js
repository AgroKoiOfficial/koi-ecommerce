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

  const { id } = req.query;
  const {phone, city, postalCode, province, street, userId } = req.body;

  try {
    const existingAddress = await prisma.address.findUnique({
      where: {
        id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id,
      },
      data: {
        phone: phone || existingAddress.phone,
        city: city || existingAddress.city,
        postalCode: postalCode || existingAddress.postalCode,
        province: province || existingAddress.province,
        street: street || existingAddress.street,
        userId: userId || existingAddress.userId,
      },
    });

    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

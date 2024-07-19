import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import validator from "validator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { phone, city, postalCode, province, street, userId } = req.body;

  const sanitizedPhone = validator.escape(phone);
  const sanitizedCity = validator.escape(city);
  const sanitizedPostalCode = validator.escape(postalCode);
  const sanitizedProvince = validator.escape(province);
  const sanitizedStreet = validator.escape(street);

  try {
    const address = await prisma.address.create({
      data: {
        phone: sanitizedPhone,
        city: sanitizedCity,
        postalCode: sanitizedPostalCode,
        province: sanitizedProvince,
        street: sanitizedStreet,
        userId,
      },
    });
    console.log(address);
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

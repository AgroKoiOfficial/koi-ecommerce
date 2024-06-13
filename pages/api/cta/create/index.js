import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, phoneNumber, message, active } = req.body;

  try {
    const newService = await prisma.customerService.create({
      data: {
        name,
        phoneNumber,
        message,
        active,
      },
    });
    return res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating customer service:", error);
    return res.status(500).json({ message: "Failed to create customer service" });
  }
}

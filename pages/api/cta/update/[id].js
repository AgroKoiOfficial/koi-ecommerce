import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, name, phoneNumber, message, active } = req.body;

  try {
    const updatedService = await prisma.customerService.update({
      where: { id },
      data: {
        name,
        phoneNumber,
        message,
        active,
      },
    });
    return res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error updating customer service:", error);
    return res.status(500).json({ message: "Failed to update customer service" });
  }
}
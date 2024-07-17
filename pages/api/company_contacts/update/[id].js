import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { address, email, phone } = req.body;

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID parameter" });
  }

  try {
    const updatedContact = await prisma.companyContact.update({
      where: { id: id },
      data: {
        address: address,
        email: email,
        phone: phone,
      },
    });

    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

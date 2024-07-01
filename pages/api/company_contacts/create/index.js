import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { address, phone, email } = req.body;

    if (!address || !phone || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const newContact = await prisma.companyContact.create({
        data: {
          address,
          phone,
          email,
        },
      });
      return res.status(200).json(newContact);
    } catch (error) {
      return res.status(500).json({ error: "Failed to add contact" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

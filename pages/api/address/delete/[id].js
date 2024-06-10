import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    const existingAddress = await prisma.address.findUnique({
      where: {
        id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    await prisma.address.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

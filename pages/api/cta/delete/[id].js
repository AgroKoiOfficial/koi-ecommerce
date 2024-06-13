import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    const deletedService = await prisma.customerService.delete({
      where: { id },
    });
    return res.status(200).json(deletedService);
  } catch (error) {
    console.error("Error deleting customer service:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete customer service" });
  }
}

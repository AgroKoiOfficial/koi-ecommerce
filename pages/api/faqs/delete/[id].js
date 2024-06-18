import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.status !== "DELETE") {
    res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    const deletedFaq = await prisma.fAQ.delete({
      where: {
        id,
      },
    });

    res.status(200).json(deletedFaq);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

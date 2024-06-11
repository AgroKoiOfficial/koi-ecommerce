import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  const { id } = req.query;

  try {
    const address = await prisma.address.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

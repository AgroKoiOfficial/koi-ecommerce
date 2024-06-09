import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const id = req.query.id;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const deletedCoupon = await prisma.coupon.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json(deletedCoupon);
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

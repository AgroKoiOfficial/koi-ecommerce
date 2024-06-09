import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const id = req.query.id;

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { code, decimalValue, percentValue, discountType, expiration } = req.body;

  if (discountType === "DECIMAL" && percentValue != null) {
    return res.status(400).json({ message: "Percent value should be null when discount type is DECIMAL" });
  }

  if (discountType === "PERCENT" && decimalValue != null) {
    return res.status(400).json({ message: "Decimal value should be null when discount type is PERCENT" });
  }

  if (!code || !expiration || (!decimalValue && !percentValue)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const updatedCoupon = await prisma.coupon.update({
      where: {
        id: id,
      },
      data: {
        code,
        decimalValue: discountType === "DECIMAL" ? decimalValue : null,
        percentValue: discountType === "PERCENT" ? percentValue : null,
        discountType,
        expiration: new Date(expiration), 
      },
    });

    return res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

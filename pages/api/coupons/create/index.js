import { prisma } from "@/prisma/prisma";
import { format } from "date-fns-tz";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
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

    const localTimezone = "Asia/Jakarta";
    const dateObj = new Date(expiration);
    const formattedExpiration = format(dateObj, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: localTimezone });

    const coupon = await prisma.coupon.create({
      data: {
        code,
        decimalValue: discountType === "DECIMAL" ? decimalValue : null,
        percentValue: discountType === "PERCENT" ? percentValue : null,
        discountType,
        expiration: new Date(formattedExpiration),
      },
    });

    return res.status(201).json(coupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

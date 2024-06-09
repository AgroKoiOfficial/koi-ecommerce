import { prisma } from "@/prisma/prisma";
import { format } from "date-fns-tz";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { id } = req.query;

  try {
    const coupon = await prisma.coupon.findUnique({
      where: {
        id,
      },
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const localTimezone = "Asia/Jakarta";
    const formattedCoupon = {
      ...coupon,
      expiration: format(
        new Date(coupon.expiration),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
        { timeZone: localTimezone }
      ),
    };

    return res.status(200).json(formattedCoupon);
  } catch (error) {
    console.error("Error retrieving coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

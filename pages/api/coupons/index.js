import { prisma } from "@/prisma/prisma";
import { format } from "date-fns-tz";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const coupons = await prisma.coupon.findMany();
        const localTimezone = "Asia/Jakarta";
        const formattedCoupons = coupons.map(coupon => ({
            ...coupon,
            expiration: format(new Date(coupon.expiration), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: localTimezone })
          }));
        return res.status(200).json(formattedCoupons);
    } catch (error) {
        console.error("Error retrieving coupons:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
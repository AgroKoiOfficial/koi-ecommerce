import { prisma } from "@/prisma/prisma";
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const checkouts = await prisma.checkout.findMany({
      include: {
        address: true,
        shipping: true,
        coupon: true,
      },
    });

    const simplifiedCheckouts = checkouts.map((checkout) => ({
      id: checkout.id,
      total: checkout.total,
      quantity: checkout.quantity,
      status: checkout.status,
      user: {
        id: checkout.cart.create[0].userId,
      },
      address: {
        city: checkout.address.city,
        province: checkout.address.province,
        phone: checkout.address.phone,
      },
      shipping: {
        city: checkout.shipping.city,
        region: checkout.shipping.region,
        fee: checkout.shipping.fee,
      },
      coupon: checkout.coupon
        ? {
            code: checkout.coupon.code || "",
            discountType: checkout.coupon.discountType || "",
          }
        : null,
    }));

    return res.status(200).json({ checkouts: simplifiedCheckouts });
  } catch (error) {
    console.error("Error getting checkouts:", error);
    return res.status(500).json({ message: "Failed to get checkouts" });
  }
}

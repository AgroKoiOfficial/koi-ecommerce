import { prisma } from "@/prisma/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const session = await getSession({ req });

//   if (!session || !session.user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

  const userId = session.user.id;

  try {
    const userCheckouts = await prisma.checkout.findMany({
      where: {
        cart: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        address: true,
        shipping: true,
        coupon: true,
      },
    });

    const simplifiedCheckouts = userCheckouts.map((checkout) => ({
      id: checkout.id,
      total: checkout.total,
      quantity: checkout.quantity,
      status: checkout.status,
      address: {
        city: checkout.address.city,
        province: checkout.address.province,
      },
      shipping: {
        city: checkout.shipping.city,
        region: checkout.shipping.region,
        fee: checkout.shipping.fee,
      },
      coupon: {
        code: checkout.coupon.code,
        discountType: checkout.coupon.discountType,
      },
    }));

    return res.status(200).json({ checkouts: simplifiedCheckouts });
  } catch (error) {
    console.error("Error getting user checkouts:", error);
    return res.status(500).json({ message: "Failed to get user checkouts" });
  }
}

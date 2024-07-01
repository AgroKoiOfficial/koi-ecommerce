import { prisma } from "@/prisma/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  try {
    console.log("Fetching checkouts for user:", userId);

    const userCheckouts = await prisma.checkout.findMany({
      where: {
        address: {
          userId: userId
        }
      },
      include: {
        address: true,
        shipping: true,
        coupon: true,
        payments: true,
      }
    });

    // console.log("User checkouts found:", userCheckouts);

    const checkoutsWithRelations = userCheckouts.map(checkout => ({
      ...checkout,
      address: {
        city: checkout.address.city,
        province: checkout.address.province,
        postalCode: checkout.address.postalCode,
        street: checkout.address.street,
        phone: checkout.address.phone
      },
      shipping: checkout.shipping
        ? {
            city: checkout.shipping.city,
            region: checkout.shipping.region,
            fee: checkout.shipping.fee
          }
        : null,
      coupon: checkout.coupon
        ? {
            code: checkout.coupon.code,
            discountType: checkout.coupon.discountType,
          }
        : null
    }));

    console.log("Checkouts with relations:", checkoutsWithRelations);

    return res.status(200).json({ checkouts: checkoutsWithRelations });
  } catch (error) {
    console.error("Error getting user checkouts:", error);
    return res.status(500).json({ message: "Failed to get user checkouts" });
  }
}

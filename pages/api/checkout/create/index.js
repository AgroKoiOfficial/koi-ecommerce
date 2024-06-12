import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import { sendCheckoutEmail } from "@/utils/sendCheckout.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId, addressId, shippingId, couponId, cart } = req.body;

  try {
    if (!userId || !addressId || !shippingId || !cart || cart.length === 0) {
      console.error("Invalid input data:", req.body);
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    let quantity = 0;
    let discount = 0;

    for (const cartItem of cart) {
      if (!cartItem.product || !cartItem.product.price || !cartItem.quantity) {
        console.error("Invalid cart item:", cartItem);
        return res.status(400).json({ message: "Invalid cart item" });
      }

      total += parseInt(cartItem.product.price) * parseInt(cartItem.quantity);
      quantity += parseInt(cartItem.quantity);
    }

    console.log("Total before discount:", total);
    console.log("Quantity:", quantity);

    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          id: couponId,
        },
      });

      if (!coupon) {
        console.error("Coupon not found for id:", couponId);
        return res.status(404).json({ message: "Coupon not found" });
      }

      console.log("Coupon found:", coupon);

      if (coupon.discountType === "PERCENT") {
        discount = total * (coupon.percentValue / 100);
      } else {
        discount = coupon.decimalValue;
      }

      total -= discount;

      if (total < 0) {
        total = 0;
      }

      console.log("Total after discount:", total);
    }

    const shipping = await prisma.shipping.findUnique({
      where: {
        id: shippingId,
      },
    });

    if (!shipping) {
      console.error("Shipping not found for id:", shippingId);
      return res.status(404).json({ message: "Shipping not found" });
    }

    console.log("Shipping found:", shipping);

    total += parseInt(shipping.fee);

    const defaultStatus = "UNPAID";

    const newCheckout = await prisma.checkout.create({
      data: {
        addressId: addressId,
        shippingId: shippingId,
        total: total,
        quantity: quantity,
        couponId: couponId,
        status: defaultStatus,
        cart: { create: cart },
      },
    });
    
    for (const cartItem of cart) {
      await prisma.product.update({
        where: {
          id: cartItem.product.id,
        },
        data: {
          stock: {
            decrement: cartItem.quantity,
          },
        },
      });
    }

    await prisma.cart.deleteMany({
      where: {
        userId: userId,
      },
    });

    await sendCheckoutEmail(token.email, cart, discount, total);

    console.log("Checkout created successfully:", newCheckout);

    return res.status(201).json({
      message: "Checkout created successfully",
      checkout: newCheckout,
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    return res.status(500).json({ message: "Failed to create checkout" });
  }
}

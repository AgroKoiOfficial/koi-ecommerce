import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import { sendCheckoutEmail } from "@/utils/sendCheckout.js";
import { sendCheckoutToAdmin } from "@/utils/sendCheckoutToAdmin.js";
import { xenditInvoiceClient } from "@/lib/xendit";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metode tidak diizinkan" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Tidak diizinkan" });
  }

  const { userId, addressId, shippingId, couponId, cart } = req.body;

  try {
    if (!userId || !addressId || !shippingId || !cart || cart.length === 0) {
      return res.status(400).json({ message: "Keranjang kosong" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return res.status(404).json({ message: "Alamat tidak ditemukan" });
    }

    let total = 0;
    let quantity = 0;
    let discount = 0;

    for (const cartItem of cart) {
      if (
        !cartItem.product ||
        !cartItem.product.id ||
        !cartItem.product.price ||
        !cartItem.quantity
      ) {
        return res.status(400).json({ message: "Item keranjang tidak valid" });
      }

      total += parseInt(cartItem.product.price) * parseInt(cartItem.quantity);
      quantity += parseInt(cartItem.quantity);
    }

    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });

      if (!coupon) {
        console.error("Kupon tidak ditemukan untuk id:", couponId);
        return res.status(404).json({ message: "Kupon tidak ditemukan" });
      }

      if (coupon.discountType === "PERCENT") {
        discount = total * (coupon.percentValue / 100);
      } else {
        discount = coupon.decimalValue;
      }

      total -= discount;

      if (total < 0) {
        total = 0;
      }

    }

    const shipping = await prisma.shipping.findUnique({
      where: { id: shippingId },
    });

    if (!shipping) {
      return res.status(404).json({ message: "Pengiriman tidak ditemukan" });
    }

    const shippingFee = parseInt(shipping.fee);
    total += shippingFee;

    const defaultStatus = "UNPAID";

    const adminWhatsAppNumbers = [
      "+6285648741082",
      "+6281262465409",
      "+6282257511815",
    ];

    const randomAdminWhatsApp =
      adminWhatsAppNumbers[
        Math.floor(Math.random() * adminWhatsAppNumbers.length)
      ];

    const newCheckout = await prisma.checkout.create({
      data: {
        userId: userId,
        addressId: addressId,
        shippingId: shippingId,
        total: total,
        quantity: quantity,
        couponId: couponId,
        adminWhatsAppNumber: randomAdminWhatsApp,
        status: defaultStatus,
        cart: { create: cart },
      },
    });

    for (const cartItem of cart) {
      await prisma.product.update({
        where: { id: cartItem.product.id },
        data: { stock: { decrement: cartItem.quantity } },
      });
    }

    await prisma.cart.deleteMany({
      where: { userId: userId },
    });

    let redirectPaymentUrl = "/";

    // Create Invoice
    const data = {
      amount: total,
      payerEmail: user.email,
      shouldSendEmail: true,
      customer: {
        givenNames: user.name,
        email: user.email,
        mobileNumber: address.phone,
      },
      invoiceDuration: 21600,
      externalId: newCheckout.id,
      description: `Pembelian produk dengan id ${newCheckout.id}`,
      currency: "IDR",
      reminderTime: 1,
      items: cart.map((item) => ({
        referenceId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        url: `${process.env.BASE_URL}/products/${item.product.slug}`,
      })),
      customerNotificationPreferences: {
        invoiceCreated : ['email', 'whatsapp'],
        invoiceReminder : ['email', 'whatsapp'],
        invoicePaid : ['email', 'whatsapp'],
      },
      successRedirectUrl: `${process.env.BASE_URL}/user/checkout-history`,
      failureRedirectUrl: `${process.env.BASE_URL}/checkout/`,
      metadata: {
        store : "Koi Toko",
      },
      webhookUrl: `${process.env.BASE_URL}/api/xendit/webhook`,
    };

    try {
      const response = await xenditInvoiceClient.createInvoice({ data });
      redirectPaymentUrl= response.invoiceUrl;

      await prisma.checkout.update({
        where: { id: newCheckout.id },
        data: { redirectUrl: redirectPaymentUrl },
      })
      sendCheckoutEmail(user.email, cart, discount, shippingFee, total);
      sendCheckoutToAdmin(user, address, cart, discount, shippingFee, total);
      return res
        .status(200)
        .json({ checkout: newCheckout, paymentRequests: response, redirect: redirectPaymentUrl });
    } catch (error) {
      return res.status(500).json({
        message: "Gagal membuat invoice",
        error: error.response ? error.response.data : error.message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Gagal membuat invoice", error: error.message });
  }
}

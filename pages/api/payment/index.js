import Midtrans from "midtrans-client";
import { prisma } from "@/prisma/prisma";

const snap = new Midtrans.Snap({
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userId, checkoutId, status } = req.body;

    try {
        const checkout = await prisma.checkout.findUnique({
            where: { id: checkoutId },
        });

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { total, quantity } = checkout;

        const transaction = await prisma.payment.create({
            data: {
                userId,
                checkoutId,
                total,
                quantity,
                status,
            },
        });

        const parameters = {
            transaction_details: {
                order_id: transaction.id,
                gross_amount: total,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                first_name: user.name,
                email: user.email,
            },
        };

        snap
            .createTransaction(parameters)
            .then((midtransTransaction) => {
                res.status(200).json({ url: midtransTransaction.redirect_url });
            })
            .catch((error) => {
                console.error('Transaction Handler Error:', error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            });

    } catch (error) {
        console.error('Transaction Handler Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

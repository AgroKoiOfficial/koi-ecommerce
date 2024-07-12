import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const xCallbackToken = req.headers["x-callback-token"];

  if (xCallbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { external_id, status } = req.body;

  console.log("Received external_id:", external_id);
  console.log("Received status:", status);

  try {
    const existingCheckout = await prisma.checkout.findUnique({
      where: {
        id: external_id,
      },
    });

    if (!existingCheckout) {
      return res.status(404).json({ message: "Checkout record not found" });
    }

    const checkout = await prisma.checkout.update({
      where: {
        id: external_id,
      },
      data: {
        status: status === "SETTLED" ? "PAID" : "UNPAID",
      },
    });

    return res.status(200).json({ checkout: checkout, message: "Payment status updated" });
  } catch (error) {
    console.error("Error updating checkout:", error);
    return res.status(500).json({ error });
  }
}

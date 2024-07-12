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

  console.log("Incoming webhook request:", req.body);

  try {
    const checkout = await prisma.checkout.findUnique({
      where: { id: external_id },
    });

    if (!checkout) {
      console.error("Checkout not found for id:", external_id);
      return res.status(404).json({ message: "Checkout not found" });
    }

    let updatedStatus;
    if (status === "settlement" || status === "capture") {
      updatedStatus = "PAID";
    } else if (status === "cancel" || status === "deny" || status === "expire") {
      updatedStatus = "FAILED";
    }

    if (updatedStatus) {
      const updatedCheckout = await prisma.checkout.update({
        where: { id: external_id },
        data: { status: updatedStatus },
      });

      return res.status(200).json({ message: "Checkout status updated", checkout: updatedCheckout });
    }

    return res.status(200).json({ message: "No action required" });
  } catch (error) {
    console.error("Error updating checkout status:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
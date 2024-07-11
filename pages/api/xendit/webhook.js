import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const xenditCallbackToken = req.headers['x-callback-token'];
  const webhookId = req.headers['webhook-id'];

  if (!xenditCallbackToken || xenditCallbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
    return res.status(403).json({ message: "Invalid token" });
  }

  if (!webhookId) {
    return res.status(400).json({ message: "Webhook ID is required" });
  }

  const event = req.body;

  try {

    const existingWebhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (existingWebhook) {
      return res.status(200).json({ message: "Duplicate webhook, ignored" });
    }

    await prisma.webhook.create({
      data: { id: webhookId, receivedAt: new Date() },
    });

    if (event && event.external_id && event.status) {
      const { external_id, status } = event;

      await prisma.checkout.update({
        where: { id: external_id },
        data: { status: status.toUpperCase() },
      });

      console.log(`Checkout status updated: ${external_id} -> ${status}`);
      return res.status(200).json({ message: "Success" });
    } else {
      console.error("Invalid event data:", event);
      return res.status(400).json({ message: "Invalid event data" });
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

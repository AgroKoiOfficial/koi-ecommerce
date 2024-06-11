import { prisma } from "@/prisma/prisma";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const userId = req.query.userId;

  try {
    const userAddresses = await prisma.address.findMany({
      where: {
        userId: userId,
      },
    });

    if (!userAddresses || userAddresses.length === 0) {
      return res
        .status(404)
        .json({ message: "No addresses found for the user" });
    }

    return res.status(200).json(userAddresses);
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return res.status(500).json({ message: "Failed to fetch user addresses" });
  }
}

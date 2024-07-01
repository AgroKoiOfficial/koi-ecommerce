import { prisma } from "@/prisma/prisma";
import { subDays } from "date-fns";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const startDate = subDays(new Date(), 30);

    const checkouts = await prisma.checkout.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    });

    const checkoutCountByDate = checkouts.reduce((acc, checkout) => {
      const date = checkout.createdAt.toISOString().split("T")[0];
      const status = checkout.status;

      if (!acc[date]) {
        acc[date] = { PAID: 0, UNPAID: 0 };
      }

      acc[date][status]++;
      return acc;
    }, {});

    return res.status(200).json(checkoutCountByDate);
  } catch (error) {
    console.error("Error fetching checkout data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

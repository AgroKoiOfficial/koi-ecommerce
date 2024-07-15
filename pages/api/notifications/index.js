// import { getSession } from "next-auth/react";
import { prisma } from "@/prisma/prisma";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Tidak diizinkan" });
  }

  if (req.method === "GET") {
    // Memuat notifikasi checkout
    const notifications = await prisma.checkout.findMany({
      where: { userId: session.user.id, status: { not: "PAID" } },
    });
    return res.status(200).json({ notifications });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    // Menghapus notifikasi checkout
    const deletedNotification = await prisma.checkout.delete({
      where: { id: id },
    });
    return res.status(200).json({ deletedNotification });
  }

  return res.status(405).json({ message: "Metode tidak diizinkan" });
}

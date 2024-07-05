import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Received token:", token);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.query;
    const { deleteToken } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: token.sub },
    });
    console.log("Found user:", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "ADMIN") {
      const deletedUser = await prisma.user.delete({
        where: { id },
      });

      return res.status(200).json(deletedUser);
    } else {
      if (id !== token.sub) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const userToDelete = await prisma.user.findUnique({
        where: { id },
      });

      if (!userToDelete || userToDelete.deleteToken !== deleteToken) {
        return res.status(400).json({ error: "Invalid delete token" });
      }

      const deletedUser = await prisma.user.delete({
        where: { id },
      });

      return res.status(200).json(deletedUser);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

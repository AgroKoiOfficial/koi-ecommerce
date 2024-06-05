import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import * as argon2 from "argon2";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // console.log("Token:", token);

    if (!token || !token.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id: userId } = req.query;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (token.role === "ADMIN" || token.sub === userId) {
      const { name, email, password, role } = req.body;
      let dataToUpdate = {
        name,
        email,
      };

      if (token.role === "ADMIN") {
        dataToUpdate.role = role;
      }

      if (password) {
        const hashedPassword = await argon2.hash(password);
        dataToUpdate.password = hashedPassword;
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: dataToUpdate,
      });

      return res.status(200).json(updatedUser);
    }

    return res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

import { prisma } from "@/prisma/prisma";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const isAdminEmail = email.endsWith("admin@example.com");
  const role = isAdminEmail ? "ADMIN" : "USER";

  const hashedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(201).json({ user, token });
}

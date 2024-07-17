import { prisma } from "@/prisma/prisma";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import validator from "validator";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua kolom harus diisi" });
  }

  const sanitizedName = validator.escape(name);
  const sanitizedEmail = validator.normalizeEmail(email);
  const sanitizedPassword = validator.escape(password);

  if (!validator.isEmail(sanitizedEmail)) {
    return res.status(400).json({ message: "Format email tidak valid" });
  }

 
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(sanitizedPassword)) {
    return res.status(400).json({ message: "Password harus terdiri dari minimal 8 karakter dan terdapat minimal 1 angka" });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: sanitizedEmail,
    },
  });

  if (existingUser) {
    return res.status(409).json({ message: "Email sudah terdaftar" });
  }

  const isAdminEmail = sanitizedEmail.endsWith(`${process.env.EMAIL_ADMIN}`);
  const role = isAdminEmail ? "ADMIN" : "USER";

  const hashedPassword = await argon2.hash(sanitizedPassword);

  const user = await prisma.user.create({
    data: {
      name : sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      role,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(201).json({ user, token });
}

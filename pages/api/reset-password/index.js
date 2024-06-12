import { prisma } from "@/prisma/prisma";
import { transporter } from "@/utils/email";
import * as argon2 from "argon2";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, resetToken, newPassword } = req.body;

  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or reset token" });
    }

    const hashedPassword = await argon2.hash(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
          resetToken: null,
        },
      }),
    ]);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Successful",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Password Reset Successful</h1>
        <p style="font-size: 16px; color: #555; margin-bottom: 20px;">Your password has been reset successfully.</p>
      </div>
    `,
      replyTo: "noreply@example.com",
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

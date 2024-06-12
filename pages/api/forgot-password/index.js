import { transporter } from "@/utils/email";
import { prisma } from "@/prisma/prisma";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const resetToken = uuidv4();

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetToken,
      },
    });

    const url = `${process.env.NEXT_PUBLIC_URL}/reset-password/`;

    const message = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Forgot Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Forgot Password</h1>
          <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
            You have requested to reset your password. Please click the link below to reset your password:
          </p>
          <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="font-size: 14px; color: #777; margin-bottom: 20px;">
          please copy code below
          </p>
          <p style="font-size: 14px; color: #777; margin-bottom: 20px;">
          ${resetToken}
          </p>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            If you did not request to reset your password, please ignore this email.
          </p>
        </div>
      `,
    });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}

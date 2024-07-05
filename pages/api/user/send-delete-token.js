import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import { transporter } from "@/utils/email";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.sub },
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const deleteToken = uuidv4();

    await prisma.user.update({
      where: { id: token.sub },
      data: { deleteToken },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Permintaan Penghapusan Akun",
      html: `
        <html>
          <head>
            <style>
              .container {
                width: 80%;
                margin: 0 auto;
                padding: 20px;
                font-family: Arial, sans-serif;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
              }
              .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 1px solid #ddd;
                margin-bottom: 20px;
              }
              .content {
                text-align: center;
                padding: 20px;
              }
              .footer {
                text-align: center;
                padding: 10px 0;
                border-top: 1px solid #ddd;
                margin-top: 20px;
                font-size: 12px;
                color: #777;
              }
              .btn {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 8px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Permintaan Penghapusan Akun</h2>
              </div>
              <div class="content">
                <p>Halo, ${user.name}</p>
                <p>Anda telah meminta untuk menghapus akun Anda. Silakan gunakan token berikut untuk menghapus akun Anda:</p>
                <p><strong>${deleteToken}</strong></p>
                <p>Jika Anda tidak meminta ini, silakan abaikan email ini.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 Agro Koi. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Token penghapusan dikirim ke email" });
  } catch (error) {
    return res.status(500).json({ error: "Kesalahan internal server" });
  }
}
 
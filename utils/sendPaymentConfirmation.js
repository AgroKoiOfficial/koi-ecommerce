import nodemailer from 'nodemailer';
import { formatRupiah } from "./currency.js";

export const sendPaymentConfirmationEmail = async (email, checkout) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Konfirmasi Pembayaran',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Konfirmasi Pembayaran</h1>
        <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
          Pembayaran Anda untuk order <b>${checkout.id}</b> telah berhasil.
        </p>
        <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
          Total: ${formatRupiah(Number(checkout.total))}
        </p>
        <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
          Status: ${checkout.status}
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email konfirmasi pembayaran berhasil dikirim.');
  } catch (error) {
    console.error('Kesalahan saat mengirim email konfirmasi pembayaran:', error);
  }
};


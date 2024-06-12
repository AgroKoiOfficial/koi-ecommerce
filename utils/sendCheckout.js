import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const formatRupiah = (number) => {
  return number.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
};

export const sendCheckoutEmail = async (tokenEmail, cart, discount, total) => {
  const cartItemsHtml = cart
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.product.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatRupiah(Number(item.product.price))}</td>
        </tr>
      `
    )
    .join("");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Checkout Sedang Diproses</h1>
      <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
        Terima kasih telah melakukan checkout. Pesanan Anda sedang diproses.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd;">Produk</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Jumlah</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Harga</th>
          </tr>
        </thead>
        <tbody>
          ${cartItemsHtml}
        </tbody>
      </table>
      <p style="font-size: 16px; color: #555; margin-top: 20px;">
        Diskon: ${discount > 0 ? formatRupiah(Number(discount)) : "Tidak ada"}
      </p>
      <p style="font-size: 16px; color: #555; margin-top: 10px;">
        Total: ${formatRupiah(Number(total))}
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: tokenEmail,
      subject: "Checkout Sedang Diproses",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

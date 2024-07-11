import { xenditInvoiceClient } from "@/lib/xendit";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Metode tidak diizinkan" });
    }

    const data = {
      amount : 10000,
  invoiceDuratio : 172800,
  externalId : "test1234",
  description : "Test Invoice",
  currency : "IDR",
  reminderTime : 1,
  successRedirectUrl: "https://example.com/success",
  customer : {
    givenNames : "John Doe",
    email : "p3lXu@example.com",
    mobileNumber: "+6281234567890",
  },
  locale: "ID",
    }

    try {
        const response = await xenditInvoiceClient.createInvoice({data});
        res.status(200).json(response);
    } catch (error) {
        console.error("Error creating invoice:", error);

        const errorMessage = error.response?.data?.message || error.message || "Internal Server Error";
        const errorCode = error.response?.data?.error_code || "UNKNOWN_ERROR";
        const errors = error.response?.data?.errors || [];

        res.status(500).json({
            message: errorMessage,
            error_code: errorCode,
            errors: errors
        });
    }
}

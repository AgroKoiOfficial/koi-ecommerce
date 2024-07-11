import { Xendit, Invoice as InvoiceClient } from 'xendit-node';

export const xendit = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY,
});

export const xenditInvoiceClient = new InvoiceClient({
    secretKey: process.env.XENDIT_SECRET_KEY,
})
import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import CheckoutList from "@/components/dashboards/CheckoutList";

export default function CheckoutHistory() {
    const title = "Checkout History";

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <AdminDashboard title={title} >
                <main className="mt-20">
                    <CheckoutList />
                </main>
            </AdminDashboard>
        </>
    );
}

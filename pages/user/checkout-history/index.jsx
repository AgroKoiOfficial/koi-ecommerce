import React from "react";
import Head from "next/head";
import UserDashboard from "@/layouts/UserDashboard";
import CheckoutHistory from "@/components/users/CheckoutHistory";

export default function UserCheckoutHistory() {
    const title = "User Checkout History";

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="users" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <UserDashboard title={title}>
                <main className="pt-20">
                    <CheckoutHistory />
                </main>
            </UserDashboard>
        </>
    );
}
import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";

export default function Dashboard() {
    const title = "Dashboard";

    return (
        <>
        <Head>
            <title>{title}</title>
            <meta name="description" content="dashboard" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffffff" />
            <link rel="icon" href="/logo.png" />
        </Head>
        <AdminDashboard title={title}>
            <main className="mt-20">
                hello
            </main>
        </AdminDashboard>
        </>
    );
}

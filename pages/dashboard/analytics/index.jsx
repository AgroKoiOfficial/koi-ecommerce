import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import GoogleAnalytics from "@/components/dashboards/GoogleAnalytics";

export default function Analytics() {
    const title ="Analytics";

    return (
        <>
        <Head>
            <title>{title}</title>
            <meta name="description" content="analytics" />
            </Head>
        <AdminDashboard title={title}>
            <main className="mt-20">
               <GoogleAnalytics />
            </main>
        </AdminDashboard>
        </>
    );
}
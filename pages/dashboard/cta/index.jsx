import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import CtaComponent from "@/components/dashboards/CtaComponent";

export default function Cta() {
    const title = "Customer Service";
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="customer service" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <AdminDashboard title={title}>
            <main className="pt-20">
                <CtaComponent />
            </main>
            </AdminDashboard>
        </>
    );
}
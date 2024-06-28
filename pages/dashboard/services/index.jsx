import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import ServiceTable from "@/components/dashboards/service/ServiceTable";

export default function Services() {
    const title = "Services";
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="services" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <AdminDashboard title={title}>
                <main className="mt-20">
                    <ServiceTable />
                </main>
            </AdminDashboard>
        </>
    );
}
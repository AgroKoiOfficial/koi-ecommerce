import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import Term from "@/components/dashboards/term-condition/Term";

export default function TermCondition() {
    const title = "Term & Service";

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <AdminDashboard title={title}>
                <main className="pt-20">
                    <Term />
                </main>
            </AdminDashboard>
        </>
    );
}
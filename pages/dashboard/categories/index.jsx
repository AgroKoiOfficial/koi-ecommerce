import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import { CategoryTable } from "@/components/dashboards/category/CategoryTable";

export default function Categories() {
    const title = "Categories";

    return (
        <>
        <Head>
            <title>{title}</title>
            <meta name="description" content="categories" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffffff" />
            <link rel="icon" href="/logo.png" />
        </Head>
        <AdminDashboard title={title}>
            <main className="mt-20">
              <CategoryTable />
            </main>
        </AdminDashboard>
        </>
    );
}

import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import { UserTable } from "@/components/dashboards/user/UserTable";

export default function Users() {
    const title = "Users";

    return (
        <>
        <Head>
            <title>{title}</title>
            <meta name="description" content="users" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffffff" />
            <link rel="icon" href="/logo.png" />
        </Head>
        <AdminDashboard title={title}>
            <main className="mt-20">
              <UserTable />
            </main>
        </AdminDashboard>
        </>
    );
}
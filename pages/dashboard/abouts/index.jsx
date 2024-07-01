import React from "react"
import Head from "next/head"
import AdminDashboard from "@/layouts/AdminDashboard"
import AdminAbout from "@/components/dashboards/about/AdminAbout"

export default function Abouts() {
    const title = "Abouts"
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="abouts" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <AdminDashboard title={title}>
                <main className="mt-20">
                    <AdminAbout />
                </main>
            </AdminDashboard>
        </>
    )
}
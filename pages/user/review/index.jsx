import React from "react";
import Head from "next/head";
import UserDashboard from "@/layouts/UserDashboard";
import Review from "@/components/users/review";

export default function UserReview () {
    const title = "User Review"

    return (
        <>
        <Head>
            <title>{title}</title>
            <meta name="description" content="users" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffffff" />
            <link rel="icon" href="/logo.png" />
        </Head>
        <UserDashboard title={title}>
            <main className="pt-20">
                <Review/>
            </main>
        </UserDashboard>
        </>
    )


}
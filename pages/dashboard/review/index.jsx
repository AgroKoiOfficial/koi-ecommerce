import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import ReviewComponent from "@/components/ReviewComponent";

export default function Review() {
  const title = "Review";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="review" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <AdminDashboard title={title}>
        <main className="mt-20">
          <ReviewComponent />
        </main>
      </AdminDashboard>
    </>
  );
}

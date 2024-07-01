import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import CompanyContact from "@/components/dashboards/contact/CompanyContact";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Dashboard - Contact</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AdminDashboard>
        <main className="mt-20">
          <CompanyContact />
        </main>
      </AdminDashboard>
    </>
  );
}

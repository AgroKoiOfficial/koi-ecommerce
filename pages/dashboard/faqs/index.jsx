import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import { FaqTable } from "@/components/dashboards/faqs/FaqTable";

export default function Faqs() {
  const title = "Faqs";
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <AdminDashboard title={title}>
        <main className="mt-20">
          <FaqTable />
        </main>
      </AdminDashboard>
    </>
  );
}

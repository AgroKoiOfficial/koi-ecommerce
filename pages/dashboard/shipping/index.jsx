import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import ShippingTable from "@/components/dashboards/shipping/ShippingTable";

export default function Shipping() {
  const title = "Shipping";
  return (
    <>
    <Head>
      <title>{title}</title>
      <meta name="description" content="shipping" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <AdminDashboard title={title}>
      <main className="mt-20">
        <ShippingTable />
      </main>
    </AdminDashboard>
    </>
  );
}

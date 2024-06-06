import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import { ProductTable } from "@/components/dashboards/product/ProductTable";

export default function Products() {
  const title = "Products";

  return (
    <>
    <Head>
      <title>{title}</title>
      <meta name="description" content="products" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" href="/logo.png" />
    </Head>
    <AdminDashboard title={title}>
      <main className="mt-20">
        <ProductTable />
      </main>
    </AdminDashboard>
    </>
  );
}

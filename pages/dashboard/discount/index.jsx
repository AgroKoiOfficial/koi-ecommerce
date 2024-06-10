import React from "react";
import Head from "next/head";
import AdminDashboard from "@/layouts/AdminDashboard";
import {Coupon} from "@/components/dashboards/coupon/Coupon";

export default function Discount() {
  const title = "Discount";
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="discount" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AdminDashboard title={title}>
        <main className="mt-20">
          <Coupon />
        </main>
      </AdminDashboard>
    </>
  );
}

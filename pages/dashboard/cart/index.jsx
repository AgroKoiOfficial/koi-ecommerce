import React from "react";
import AdminDashboard from "@/layouts/AdminDashboard";
import { AdminCart } from "@/components/dashboards/cart/AdminCart";

export default function Cart() {
    const title = "Cart";
  return (
    <AdminDashboard title={title}>
      <main className="mt-20">
        <AdminCart />
      </main>
    </AdminDashboard>
  );
}

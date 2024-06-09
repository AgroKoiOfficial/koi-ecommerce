import React from "react";
import AdminDashboard from "@/layouts/AdminDashboard";
import ShippingTable from "@/components/dashboards/shipping/ShippingTable";

export default function Shipping() {
  const title = "Shipping";
  return (
    <AdminDashboard title={title}>
      <main className="mt-20">
        <ShippingTable />
      </main>
    </AdminDashboard>
  );
}

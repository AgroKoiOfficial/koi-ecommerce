import React from "react";
import AdminDashboard from "@/layouts/AdminDashboard";
import { ProductTable } from "@/components/dashboards/product/ProductTable";

export default function Products() {
  const title = "Products";

  return (
    <AdminDashboard title={title}>
      <main className="mt-20">
        <ProductTable />
      </main>
    </AdminDashboard>
  );
}

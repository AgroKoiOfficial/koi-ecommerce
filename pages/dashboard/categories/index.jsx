import React from "react";
import AdminDashboard from "@/layouts/AdminDashboard";
import { CategoryTable } from "@/components/dashboards/category/CategoryTable";

export default function Categories() {
    const title = "Categories";

    return (
        <AdminDashboard title={title}>
            <main className="mt-20">
              <CategoryTable />
            </main>
        </AdminDashboard>
    );
}

import React from "react";
import AdminDashboard from "@/layouts/AdminDashboard";
import { UserTable } from "@/components/dashboards/user/UserTable";

export default function Users() {
    const title = "Users";

    return (
        <AdminDashboard title={title}>
            <main className="mt-20">
              <UserTable />
            </main>
        </AdminDashboard>
    );
}
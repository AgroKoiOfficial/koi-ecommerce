import React from "react";
import AdminDashboard from "@/layouts/AdminDashboard";

export default function Dashboard() {
    const title = "Dashboard";

    return (
        <AdminDashboard title={title}>
            <div className="mt-20">
                hello
            </div>
        </AdminDashboard>
    );
}

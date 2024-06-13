import React from "react";
import UserDashboard from "@/layouts/UserDashboard";

export default function User() {
    const title = "User";

    return (
        <UserDashboard title={title}>
            <main className="pt-20">User</main>
        </UserDashboard>
    );
}
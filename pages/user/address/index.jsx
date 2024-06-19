import React from "react";
import UserDashboard from "@/layouts/UserDashboard";
import AddressInfo from "@/components/users/address/AddressInfo";

export default function UserAddress() {
    const title = "User Address";

    return (
        <UserDashboard title={title}>
            <main className="pt-20">
                <AddressInfo />
            </main>
        </UserDashboard>
    );
}
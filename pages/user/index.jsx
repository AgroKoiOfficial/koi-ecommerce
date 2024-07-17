import React from "react";
import Link from "next/link";
import UserDashboard from "@/layouts/UserDashboard";
import { useTheme } from "next-themes";

export default function User() {
  const title = "User";

  const { theme, setTheme } = useTheme();

  return (
    <UserDashboard title={title}>
      <main className="pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className={`w-full p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out`}>
            <h2 className="text-2xl text-center mb-4 font-semibold ">Review</h2>
            <Link href="/user/review">
              <span className="block text-center text-blue-500 hover:text-blue-700 cursor-pointer">ke Review</span>
            </Link>
          </div>
          <div className={`w-full p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out`}>
            <h2 className="text-2xl text-center mb-4 font-semibold ">Riwayat Checkout</h2>
            <Link href="/user/checkout-history">
              <span className="block text-center text-blue-500 hover:text-blue-700 cursor-pointer">ke Riwayat</span>
            </Link>
          </div>
          <div className={`w-full p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out`}>
            <h2 className="text-2xl text-center mb-4 font-semibold ">Pengaturan User</h2>
            <Link href="/user/user-management">
              <span className="block text-center text-blue-500 hover:text-blue-700 cursor-pointer">ke Pengaturan User</span>
            </Link>
          </div>
          <div className={`w-full p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out`}>
            <h2 className="text-2xl text-center mb-4 font-semibold ">Alamat</h2>
            <Link href="/user/address">
              <span className="block text-center text-blue-500 hover:text-blue-700 cursor-pointer">ke Alamat</span>
            </Link>
          </div>
        </div>
      </main>
    </UserDashboard>
  );
}

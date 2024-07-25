import React from "react";
import Head from "next/head";
import Link from "next/link";
import AdminDashboard from "@/layouts/AdminDashboard";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const title = "Dashboard";
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <AdminDashboard title={title}>
        <main className="mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-center mx-auto p-4 gap-4">
            <div
              className={`w-full lg:w-1/2 p-6 ${
                theme === "dark"
                  ? "shadow-md shadow-gray-700"
                  : "shadow-md shadow-gray-300"
              } shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out`}>
              <h2 className="text-2xl text-center mb-4 font-semibold">
                Google Analytics
              </h2>
              <Link href="/dashboard/analytics">
                <span className="block text-center text-blue-500 hover:text-blue-700 cursor-pointer">
                  Go to Google Analytics
                </span>
              </Link>
            </div>
            <div
              className={`w-full lg:w-1/2 p-6 ${
                theme === "dark"
                  ? "shadow-md shadow-gray-700"
                  : "shadow-md shadow-gray-300"
              } shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out`}>
              <h2 className="text-2xl text-center mb-4 font-semibold">
                Checkouts Analytics
              </h2>
              <Link href="/dashboard/checkout">
                <span className="block text-center text-blue-500 hover:text-blue-700 cursor-pointer">
                  Go to Checkouts Analytics
                </span>
              </Link>
            </div>
          </div>
        </main>
      </AdminDashboard>
    </>
  );
}

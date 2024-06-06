import React from "react";
import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="404 - Page Not Found" />
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-12 mt-20 bg-white shadow-lg rounded-lg">
          <img
            src="/404.jpg"
            alt="Error Illustration"
            className="w-64 mx-auto mb-8"
          />
          <h1 className="text-5xl font-extrabold text-red-600 mb-4">
            404 - Page Not Found
          </h1>
          <div className="w-64 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 mb-8">
            The page you are looking for does not exist.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 text-lg font-medium text-white bg-red-600 rounded hover:bg-red-700 transition">
            Go Home
          </a>
        </div>
      </main>
    </>
  );
}

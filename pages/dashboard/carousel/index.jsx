import React, { useState } from "react";
import { getSession } from "next-auth/react";
import AdminDashboard from "@/layouts/AdminDashboard";
import AdminCarousel from "@/components/dashboards/carousel/AdminCarousel";

export default function Carousel() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      if (!session || !session.user.isAdmin) {
        setError("You are not authorized to perform this action");
        return;
      }

      const response = await fetch("/api/carousel/add", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add carousel");
      }

      const data = await response.json();

      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <AdminDashboard title="Carousel">
      <main className="mt-20">
        {message && <p className="text-red-500">{message}</p>}

        <AdminCarousel onSubmit={handleSubmit} />
      </main>
    </AdminDashboard>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

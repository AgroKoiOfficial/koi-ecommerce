import React, { useState } from "react";
import AdminDashboard from "@/layouts/AdminDashboard";
import AdminCarousel from "@/components/dashboards/carousel/AdminCarousel";

export default function Carousel() {
  return (
    <AdminDashboard title="Carousel">
      <main className="mt-20">
        <AdminCarousel />
      </main>
    </AdminDashboard>
  );
}


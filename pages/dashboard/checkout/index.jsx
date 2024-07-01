import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Chart, registerables } from "chart.js";
import AdminDashboard from "@/layouts/AdminDashboard";
import { subDays, format } from "date-fns";

export default function Dashboard() {
  const [checkouts, setCheckouts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/checkout/getData");
        if (!response.ok) {
          throw new Error("Failed to fetch checkout data");
        }
        const data = await response.json();
        setCheckouts(data);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
        setCheckouts([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Chart.register(...registerables);

    const ctx = document.getElementById("myChart")?.getContext("2d");

    if (ctx && checkouts) {
      // Ambil 30 label tanggal terakhir
      const endDate = new Date();
      const startDate = subDays(endDate, 29); // 30 hari terakhir termasuk hari ini
      const labels = [];
      const paidData = [];
      const unpaidData = [];

      for (let i = 0; i < 30; i++) {
        const date = subDays(endDate, i);
        const formattedDate = format(date, "yyyy-MM-dd");
        labels.unshift(formattedDate); // Untuk menampilkan tanggal terbaru di sebelah kanan
        const data = checkouts[formattedDate];
        paidData.unshift(data?.PAID || 0);
        unpaidData.unshift(data?.UNPAID || 0);
      }

      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "PAID",
              data: paidData,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "UNPAID",
              data: unpaidData,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [checkouts]);

  const title = "Checkouts";
  return (
    <>
      <Head>
        <title>{title} | Dashboard</title>
      </Head>
      <AdminDashboard title={title}>
        <main className="pt-20">
          <div className="w-full h-full">
            <canvas id="myChart"></canvas>
          </div>
        </main>
      </AdminDashboard>
    </>
  );
}

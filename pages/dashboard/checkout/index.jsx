import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Chart, registerables } from "chart.js";
import AdminDashboard from "@/layouts/AdminDashboard";
import { subDays, format } from "date-fns";
import { useTheme } from "next-themes";

export default function Checkouts() {
  const [checkouts, setCheckouts] = useState([]);
  const { resolvedTheme } = useTheme();

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
      const endDate = new Date();
      const startDate = subDays(endDate, 29);
      const labels = [];
      const paidData = [];
      const unpaidData = [];

      for (let i = 0; i < 30; i++) {
        const date = subDays(endDate, i);
        const formattedDate = format(date, "yyyy-MM-dd");
        labels.unshift(formattedDate);
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
              backgroundColor: resolvedTheme === "dark" ? "rgba(54, 162, 235, 0.2)" : "rgba(75, 192, 192, 0.2)",
              borderColor: resolvedTheme === "dark" ? "rgba(54, 162, 235, 1)" : "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "UNPAID",
              data: unpaidData,
              backgroundColor: resolvedTheme === "dark" ? "rgba(255, 99, 132, 0.2)" : "rgba(255, 159, 64, 0.2)",
              borderColor: resolvedTheme === "dark" ? "rgba(255, 99, 132, 1)" : "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: resolvedTheme === "dark" ? "white" : "black",
              },
              title: {
                display: true,
                text: 'Count',
                color: resolvedTheme === "dark" ? "white" : "black",
              },
            },
            x: {
              ticks: {
                color: resolvedTheme === "dark" ? "white" : "black",
              },
              title: {
                display: true,
                text: 'Date',
                color: resolvedTheme === "dark" ? "white" : "black",
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: resolvedTheme === "dark" ? "white" : "black",
              },
            },
          },
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [checkouts, resolvedTheme]);

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

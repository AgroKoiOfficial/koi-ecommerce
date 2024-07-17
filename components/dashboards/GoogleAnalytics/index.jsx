import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useTheme } from "next-themes";

const GoogleAnalytics = () => {
  const [pageViews, setPageViews] = useState([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await response.json();
        setPageViews(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setPageViews([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Chart.register(...registerables);

    const ctx = document.getElementById("myChart").getContext("2d");

    if (ctx && pageViews.length > 0) {
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: pageViews.map((item) => item.date),
          datasets: [
            {
              label: "Page Views",
              data: pageViews.map((item) => item.count),
              backgroundColor:
                resolvedTheme === "dark"
                  ? "rgba(54, 162, 235, 0.2)"
                  : "rgba(255, 159, 64, 0.2)",
              borderColor:
                resolvedTheme === "dark"
                  ? "rgba(54, 162, 235, 1)"
                  : "rgba(255, 159, 64, 1)",
              borderWidth: 1,
              fill: false,
              tension: 0.4,
              pointRadius: 5,
              pointHitRadius: 10,
              pointBackgroundColor:
                resolvedTheme === "dark"
                  ? "rgba(54, 162, 235, 1)"
                  : "rgba(255, 159, 64, 1)",
              pointBorderColor:
                resolvedTheme === "dark"
                  ? "rgba(54, 162, 235, 1)"
                  : "rgba(255, 159, 64, 1)",
              pointBorderWidth: 2,
              pointHoverRadius: 7,
              pointHoverBackgroundColor:
                resolvedTheme === "dark"
                  ? "rgba(54, 162, 235, 1)"
                  : "rgba(255, 159, 64, 1)",
              pointHoverBorderColor:
                resolvedTheme === "dark"
                  ? "rgba(54, 162, 235, 1)"
                  : "rgba(255, 159, 64, 1)",
              pointHoverBorderWidth: 2,
              pointHitRadius: 10,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Page Views',
                color: resolvedTheme === "dark" ? "white" : "black",
              },
              ticks: {
                color: resolvedTheme === "dark" ? "white" : "black",
              },
            },
            x: {
              title: {
                display: true,
                text: 'Date',
                color: resolvedTheme === "dark" ? "white" : "black",
              },
              grid: {
                display: true,
                color: resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
              },
              ticks: {
                color: resolvedTheme === "dark" ? "white" : "black",
                font: {
                  size: 12,
                },
                padding: 10,
                autoSkip: true,
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
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
  }, [pageViews, resolvedTheme]);

  return (
    <div className="w-full h-full">
      <canvas id="myChart" className="w-full h-full"></canvas>
    </div>
  );
};

export default GoogleAnalytics;

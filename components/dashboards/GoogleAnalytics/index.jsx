import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";

const GoogleAnalytics = () => {
  const [pageViews, setPageViews] = useState([]);

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
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: false,
              tension: 0.4,
              pointRadius: 5,
              pointHitRadius: 10,
              pointBackgroundColor: "rgba(54, 162, 235, 1)",
              pointBorderColor: "rgba(54, 162, 235, 1)",
              pointBorderWidth: 2,
              pointHoverRadius: 7,
              pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
              pointHoverBorderColor: "rgba(54, 162, 235, 1)",
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
                text: 'Page Views'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              },
              grid: {
                display: true,
              },
              ticks: {
                display: true,
                color: "rgba(0, 0, 0, 0.6)",
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
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [pageViews]);

  return (
    <div className="w-full h-full">
      <canvas id="myChart" className="w-full h-full"></canvas>
    </div>
  );
};

export default GoogleAnalytics;

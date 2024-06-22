import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(
    process.cwd(),
    "credentials/jual-ikan-koi-427102-de687bce4b93.json"
  ),
});

export default async function handler(req, res) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: "7daysAgo",
          endDate: "today",
        },
      ],
      metrics: [
        {
          name: "screenPageViews",
        },
      ],
      dimensions: [
        {
          name: "date",
        },
      ],
      pageSize: 10000,
      dimensionFilters: [
        {
          dimensionName: "pagePath",
          expressions: ["*"],
        },
        {
          dimensionName: "pageTitle",
          expressions: ["*"],
        },
        {
          dimensionName: "pagePath",
          expressions: ["*"],
        },
      ],
    });

    if (!response || !response.rows) {
      console.error("No rows found in Google Analytics API response.");
      return res.status(404).json({ error: "No data found" });
    }

    const pageViews = response.rows.map((row) => ({
      date: moment(row.dimensionValues[0]?.value).format("YYYY-MM-DD"), 
      count: parseInt(row.metricValues[0]?.value, 10) || 0,
    }));

    res.status(200).json(pageViews);
  } catch (error) {
    console.error("Error fetching page views:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

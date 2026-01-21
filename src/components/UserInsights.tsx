import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { message, Spin } from "antd";
import { DashboardAPI } from "../features/dashboard/dashboard.api";

interface ChartData {
  month: string;
  loyal: number;
  new: number;
  returning: number;
}

export function UserInsights() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await DashboardAPI.getUserInsights();

      const chartData: ChartData[] = res.map(item => ({
        month: formatMonth(item.month_year),
        loyal: item.loyal_users,
        new: item.new_users,
        returning: item.return_users,
      }));

      setData(chartData);
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-10">
          <Spin />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="line"
            />

            <Line
              type="monotone"
              dataKey="loyal"
              name="Loyal User"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="new"
              name="New User"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="returning"
              name="Returning User"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Convert "2025-01" → "Jan"
 * hoặc "01/2025" → "Jan"
 */
function formatMonth(monthYear: string): string {
  const [year, month] = monthYear.includes("-")
    ? monthYear.split("-")
    : monthYear.split("/").reverse();

  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "short" });
}

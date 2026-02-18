import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { RatingItem } from "../features/dashboard/dashboard.types";
import { DashboardAPI } from "../features/dashboard/dashboard.api";

const formatRatingData = (data: RatingItem[]) => {
  return data.map((item) => ({
    month: new Date(item.date).toLocaleString("en-US", {
      month: "short",
    }),
    rating: item.rate,
  }));
};

export function UserSatisfaction() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);

        const res = await DashboardAPI.getRatings(
          new Date().getFullYear() + "-01-01",
          new Date().getFullYear() + "-12-31"
        );

        setData(
          res.map((item) => ({
            month: new Date(item.date).toLocaleString("en-US", {
              month: "short",
            }),
            rating: item.rate,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Rating</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 5]} // rating thường 0–5
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="#22c55e"
                  fill="#86efac"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 text-center">
              <div className="text-xs text-slate-500">
                Average Rating
              </div>
              <div className="text-lg font-semibold text-slate-900">
                {(
                  data.reduce((s, i) => s + i.rating, 0) /
                  (data.length || 1)
                ).toFixed(1)}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
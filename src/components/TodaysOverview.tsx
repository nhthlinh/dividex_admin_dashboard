import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Receipt, Users, TrendingUp, UserPlus } from "lucide-react";
import { message, Spin } from "antd";
import { DashboardAPI } from "../features/dashboard/dashboard.api";
import type { TodayOverviewResponse } from "../features/dashboard/dashboard.types";

export function TodaysOverview() {
  const [data, setData] = useState<TodayOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await DashboardAPI.getTodayOverview();
      setData(res);
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading || !data) {
    return (
      <Card>
        <CardContent className="flex justify-center py-10">
          <Spin />
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      icon: Receipt,
      label: "Total transaction",
      value: data.total_transactions,
      change: `${data.percent_increase_transactions}% from yesterday`,
      bgColor: "bg-pink-50",
      iconColor: "text-pink-500",
    },
    {
      icon: Users,
      label: "Total User",
      value: data.total_users,
      change: `${data.percent_increase_users}% from yesterday`,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      icon: TrendingUp,
      label: "Total Money",
      value: data.total_money,
      change: `${data.percent_increase_money}% from yesterday`,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      icon: UserPlus,
      label: "New User",
      value: data.new_users,
      change: `${data.percent_increase_new_users}% from yesterday`,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Today's Overview</CardTitle>
          <p className="text-sm text-slate-500 mt-1">Summary</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-xl p-4`}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>

                <div className="text-xl font-semibold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-blue-600">
                  {stat.change}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Receipt, Users, TrendingUp, UserPlus } from "lucide-react";

const stats = [
  {
    icon: Receipt,
    label: "Total transaction",
    value: "1k",
    change: "+2% from yesterday",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    icon: Users,
    label: "Total User",
    value: "300",
    change: "+5% from yesterday",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: TrendingUp,
    label: "Business Ratio",
    value: "0.3",
    change: "+1.2% from yesterday",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: UserPlus,
    label: "New User",
    value: "8",
    change: "0.5% from yesterday",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

export function TodaysOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Today's Overview</CardTitle>
          <p className="text-sm text-slate-500 mt-1">Summery</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="size-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-xl p-4`}
              >
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`size-5 ${stat.iconColor}`} />
                </div>
                <div className="text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                <div className="text-xs text-blue-600">{stat.change}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

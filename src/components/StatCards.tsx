import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, Users, CreditCard, Activity } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Transactions",
    value: "12,234",
    change: "+19%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Bounce Rate",
    value: "3.24%",
    change: "-4.5%",
    trend: "down",
    icon: Activity,
  },
];

export function StatCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
        const trendColor = stat.trend === "up" ? "text-green-600" : "text-red-600";
        
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">{stat.title}</CardTitle>
              <Icon className="size-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-slate-900">{stat.value}</div>
              <div className={`flex items-center gap-1 text-xs ${trendColor} mt-1`}>
                <TrendIcon className="size-3" />
                <span>{stat.change} from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

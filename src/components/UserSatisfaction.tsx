import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { month: "Jan", lastMonth: 2800, thisMonth: 3200 },
  { month: "Feb", lastMonth: 3000, thisMonth: 3400 },
  { month: "Mar", lastMonth: 2900, thisMonth: 3100 },
  { month: "Apr", lastMonth: 3100, thisMonth: 3600 },
  { month: "May", lastMonth: 2800, thisMonth: 3300 },
  { month: "Jun", lastMonth: 3200, thisMonth: 3800 },
  { month: "Jul", lastMonth: 3000, thisMonth: 3500 },
  { month: "Aug", lastMonth: 3300, thisMonth: 3900 },
  { month: "Sep", lastMonth: 3100, thisMonth: 3700 },
  { month: "Oct", lastMonth: 3200, thisMonth: 3600 },
  { month: "Nov", lastMonth: 3000, thisMonth: 3400 },
  { month: "Dec", lastMonth: 3100, thisMonth: 3800 },
];

export function UserSatisfaction() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Satisfaction</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="lastMonth" 
              stroke="#3b82f6" 
              fill="#93c5fd"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="thisMonth" 
              stroke="#22c55e" 
              fill="#86efac"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div>
              <div className="text-xs text-slate-500">Last Month</div>
              <div className="text-sm text-slate-900">$3,504</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div>
              <div className="text-xs text-slate-500">This Month</div>
              <div className="text-sm text-slate-900">$4,504</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

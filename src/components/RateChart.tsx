import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Completed", value: 75 },
  { name: "Remain", value: 25 },
];

const COLORS = ["#3b82f6", "#22c55e", "#8b5cf6"];

export function RateChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={180}
                endAngle={0}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
            <div className="text-slate-900">75%</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div>
              <div className="text-xs text-slate-500">Completed</div>
              <div className="text-sm text-slate-900">3,004</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div>
              <div className="text-xs text-slate-500">Remain</div>
              <div className="text-sm text-slate-900">4,504</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

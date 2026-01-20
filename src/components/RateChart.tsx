import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Completed", value: 58.5 },
  { name: "Remain", value: 41.5 },
];

const COLORS = ["#3b82f6", "#22c55e", "#8b5cf6"];

export function RateChart() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Rate</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="relative flex justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"              // 👈 đẩy pie xuống giữa card
                innerRadius={50}      // 👈 to hơn
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl font-semibold text-slate-900">58.5%</div>
            <div className="text-xs text-slate-500">Completed</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <div>
              <div className="text-xs text-slate-500">Completed</div>
              <div className="text-sm font-medium">3,004</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <div className="text-xs text-slate-500">Remain</div>
              <div className="text-sm font-medium">4,504</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

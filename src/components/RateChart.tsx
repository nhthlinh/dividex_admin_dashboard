import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DashboardAPI } from "../features/dashboard/dashboard.api";

interface ChartItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#8b5cf6",
  "#f97316",
  "#ec4899",
  "#14b8a6",
];

const capitalizeWords = (text: string) => {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


export function RateChart() {
  const [data, setData] = useState<ChartItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await DashboardAPI.getExpenseCategories();

      setData(
        res.map((item) => ({
          name: item.category,
          value: item.total_amount,
        }))
      );
    };

    fetchData();
  }, []);

  const totalAmount = useMemo(
    () => data.reduce((sum, i) => sum + i.value, 0),
    [data]
  );

  const activeItem =
    activeIndex !== null ? data[activeIndex] : null;

  const percentage = activeItem
    ? ((activeItem.value / totalAmount) * 100).toFixed(1)
    : null;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>

      <CardContent className="-mt-6">
        <div className="relative flex justify-center">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="55%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                activeIndex={activeIndex ?? undefined}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="pointer-events-none absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            {activeItem ? (
              <>
                <div className="text-sm text-slate-500">
                  {capitalizeWords(activeItem.name)}
                </div>
                <div className="text-xl font-semibold text-slate-900">
                  {activeItem.value.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">
                  {percentage}%
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-slate-500">
                  Total Expense
                </div>
                <div className="text-xl font-semibold text-slate-900">
                  {totalAmount.toLocaleString()}
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
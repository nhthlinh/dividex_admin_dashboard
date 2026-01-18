import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const revenueData = [
  { name: "Jan", total: 4200 },
  { name: "Feb", total: 3800 },
  { name: "Mar", total: 5200 },
  { name: "Apr", total: 4600 },
  { name: "May", total: 6100 },
  { name: "Jun", total: 5800 },
  { name: "Jul", total: 7200 },
  { name: "Aug", total: 6900 },
  { name: "Sep", total: 8100 },
  { name: "Oct", total: 7600 },
  { name: "Nov", total: 9200 },
  { name: "Dec", total: 8800 },
];

const usersData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1400 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2100 },
  { name: "May", total: 2400 },
  { name: "Jun", total: 2800 },
  { name: "Jul", total: 3200 },
  { name: "Aug", total: 3600 },
  { name: "Sep", total: 4100 },
  { name: "Oct", total: 4500 },
  { name: "Nov", total: 5200 },
  { name: "Dec", total: 5800 },
];

const performanceData = [
  { name: "Jan", total: 85 },
  { name: "Feb", total: 82 },
  { name: "Mar", total: 88 },
  { name: "Apr", total: 91 },
  { name: "May", total: 89 },
  { name: "Jun", total: 93 },
  { name: "Jul", total: 95 },
  { name: "Aug", total: 92 },
  { name: "Sep", total: 96 },
  { name: "Oct", total: 94 },
  { name: "Nov", total: 97 },
  { name: "Dec", total: 98 },
];

interface OverviewProps {
  type?: "revenue" | "users" | "performance";
}

export function Overview({ type = "revenue" }: OverviewProps) {
  const data = type === "revenue" ? revenueData : type === "users" ? usersData : performanceData;
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
        <XAxis 
          dataKey="name" 
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => type === "performance" ? `${value}%` : `$${value}`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
          }}
          formatter={(value) => type === "performance" ? [`${value}%`, "Score"] : [`$${value}`, "Amount"]}
        />
        <Bar 
          dataKey="total" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { month: "Jan", loyal: 200, new: 150, returning: 180 },
  { month: "Feb", loyal: 180, new: 200, returning: 160 },
  { month: "Mar", loyal: 220, new: 180, returning: 200 },
  { month: "Apr", loyal: 250, new: 220, returning: 240 },
  { month: "May", loyal: 230, new: 280, returning: 260 },
  { month: "Jun", loyal: 280, new: 250, returning: 240 },
  { month: "Jul", loyal: 260, new: 300, returning: 280 },
  { month: "Aug", loyal: 300, new: 280, returning: 300 },
  { month: "Sep", loyal: 280, new: 320, returning: 290 },
  { month: "Oct", loyal: 320, new: 300, returning: 310 },
  { month: "Nov", loyal: 340, new: 350, returning: 330 },
  { month: "Dec", loyal: 300, new: 280, returning: 270 },
];

export function UserInsights() {
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
              wrapperStyle={{ fontSize: '12px' }}
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

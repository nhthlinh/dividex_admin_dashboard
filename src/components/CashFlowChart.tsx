import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const data = [
  { day: "Monday", deposit: 15, withdraw: 12 },
  { day: "Tuesday", deposit: 18, withdraw: 10 },
  { day: "Wednesday", deposit: 22, withdraw: 8 },
  { day: "Thursday", deposit: 16, withdraw: 12 },
  { day: "Friday", deposit: 14, withdraw: 10 },
  { day: "Saturday", deposit: 18, withdraw: 14 },
  { day: "Sunday", deposit: 20, withdraw: 16 },
];

export function CashFlowChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              angle={0}
              textAnchor="middle"
              height={60}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              label={{ value: '25k', angle: 0, position: 'top' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="deposit" 
              name="Deposit"
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar 
              dataKey="withdraw" 
              name="Withdraw"
              fill="#22c55e" 
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { DashboardAPI } from "../features/dashboard/dashboard.api";

export interface CashItem {
  deposit: number;
  withdraw: number;
  day: string;
}

export function CashFlowChart() {
  const [data, setData] = useState<CashItem[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await DashboardAPI.getCashData();

      setData(
        res.map(item => ({
          ...item,
          day: new Date(item.day).getDate() + ' ' + new Date(item.day).getMonth, // chuyển thành số ngày trong tháng + tên tháng
        }))
      );
    };

    fetchData();
  }, []);
  
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
              tickFormatter={(value) => value}
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
              barSize={10}
            />
            <Bar 
              dataKey="withdraw" 
              name="Withdraw"
              fill="#22c55e" 
              radius={[4, 4, 0, 0]}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

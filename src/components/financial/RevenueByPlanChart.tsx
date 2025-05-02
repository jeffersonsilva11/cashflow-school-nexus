
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type RevenueByPlanChartProps = {
  data: {
    plan: string;
    revenue: number;
    percentage: number;
  }[];
};

export function RevenueByPlanChart({ data }: RevenueByPlanChartProps) {
  const COLORS = ['#8B5CF6', '#0EA5E9', '#10B981'];
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border p-2 rounded-md shadow-sm">
          <p className="font-medium">{data.plan}</p>
          <p className="text-sm">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(data.revenue)}
          </p>
          <p className="text-sm">{`${data.percentage}% do total`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            dataKey="revenue"
            nameKey="plan"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

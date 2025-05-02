
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DeviceStatusData {
  active: number;
  inactive: number;
  pending: number;
  transit: number;
}

interface DeviceStatusChartProps {
  data: DeviceStatusData;
}

export const DeviceStatusChart: React.FC<DeviceStatusChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Ativos', value: data.active, color: '#10B981' },
    { name: 'Inativos', value: data.inactive, color: '#EF4444' },
    { name: 'Pendentes', value: data.pending, color: '#F59E0B' },
    { name: 'Em Trânsito', value: data.transit, color: '#3B82F6' }
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value.toLocaleString()} dispositivos`, '']} 
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

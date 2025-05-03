
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DeviceAllocationChartProps {
  data: Array<{ name: string; value: number }>;
}

export const DeviceAllocationChart: React.FC<DeviceAllocationChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [`${value.toLocaleString()} dispositivos`, '']} 
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Bar dataKey="value" fill="#8B5CF6" barSize={20} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

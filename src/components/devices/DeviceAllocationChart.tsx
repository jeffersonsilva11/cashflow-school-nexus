
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface DeviceAllocationChartProps {
  data: Array<{ name: string; value: number; }>;
  isLoading?: boolean;
}

export const DeviceAllocationChart: React.FC<DeviceAllocationChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
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


import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const DeviceAllocationChart: React.FC = () => {
  // Dados mockados para demonstração
  const data = [
    { name: 'Escola São Paulo', devices: 1892 },
    { name: 'Colégio Dom Bosco', devices: 1456 },
    { name: 'Instituto Futuro', devices: 1245 },
    { name: 'Escola Estadual Central', devices: 987 },
    { name: 'Colégio Santa Maria', devices: 843 }
  ];

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
          <Bar dataKey="devices" fill="#8B5CF6" barSize={20} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

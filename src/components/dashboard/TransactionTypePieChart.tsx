
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TransactionTypeChartProps {
  data: Array<{ name: string; value: number }>;
}

export const TransactionTypePieChart = ({ data }: TransactionTypeChartProps) => {
  const COLORS = ['#0c9ceb', '#0365a1'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Transações</CardTitle>
        <CardDescription>
          Proporção entre compras e recargas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col justify-center">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6">
            {data.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-sm">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

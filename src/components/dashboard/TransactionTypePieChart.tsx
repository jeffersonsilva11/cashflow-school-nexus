
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TransactionTypeData {
  name: string;
  value: number;
}

interface TransactionTypeChartProps {
  data: TransactionTypeData[];
}

export const TransactionTypePieChart = ({ data }: TransactionTypeChartProps) => {
  const COLORS = ['#0c9ceb', '#0365a1'];
  
  const hasData = data && data.length > 0;
  
  return (
    <div className="h-[300px] flex flex-col justify-center">
      <ResponsiveContainer width="100%" height="80%">
        {hasData ? (
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
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">Não há dados de transações disponíveis</p>
          </div>
        )}
      </ResponsiveContainer>
      {hasData && (
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
      )}
    </div>
  );
};

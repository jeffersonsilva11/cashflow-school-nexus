
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TransactionTrendData {
  date: string;
  volume: number;
}

interface TransactionTrendChartProps {
  data: TransactionTrendData[];
}

export const TransactionTrendChart = ({ data }: TransactionTrendChartProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {data && data.length > 0 ? (
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => `R$ ${value / 1000}k`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              formatter={(value) => {
                if (typeof value === 'number') {
                  return [`R$ ${value.toFixed(2)}`, 'Volume'];
                }
                return [`R$ ${value}`, 'Volume'];
              }}
            />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="#0c9ceb" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground">Não há dados de transações disponíveis</p>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

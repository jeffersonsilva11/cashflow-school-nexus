
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TransactionTrendChartProps {
  data: Array<{ date: string; volume: number }>;
}

export const TransactionTrendChart = ({ data }: TransactionTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Transações (Abr/2025)</CardTitle>
        <CardDescription>
          Volume financeiro diário do mês corrente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

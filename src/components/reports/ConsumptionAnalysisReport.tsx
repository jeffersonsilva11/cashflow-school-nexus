
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie,
  Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Dados mockados para análise de consumo
const consumptionByTimeOfDay = [
  { time: '07:00-08:00', transactions: 45, amount: 450 },
  { time: '08:00-09:00', transactions: 32, amount: 310 },
  { time: '09:00-10:00', transactions: 28, amount: 280 },
  { time: '10:00-11:00', transactions: 75, amount: 720 },
  { time: '11:00-12:00', transactions: 120, amount: 1800 },
  { time: '12:00-13:00', transactions: 150, amount: 2250 },
  { time: '13:00-14:00', transactions: 85, amount: 950 },
  { time: '14:00-15:00', transactions: 45, amount: 520 },
  { time: '15:00-16:00', transactions: 78, amount: 780 },
  { time: '16:00-17:00', transactions: 60, amount: 600 },
  { time: '17:00-18:00', transactions: 25, amount: 250 }
];

const consumptionByCategory = [
  { name: 'Lanches', value: 2850, percentage: 35 },
  { name: 'Bebidas', value: 1750, percentage: 22 },
  { name: 'Refeições', value: 1900, percentage: 24 },
  { name: 'Doces', value: 950, percentage: 12 },
  { name: 'Outros', value: 550, percentage: 7 }
];

const consumptionByGrade = [
  { grade: '1º Ano', amount: 1800, students: 45, avgPerStudent: 40 },
  { grade: '2º Ano', amount: 2200, students: 52, avgPerStudent: 42.3 },
  { grade: '3º Ano', amount: 1950, students: 48, avgPerStudent: 40.6 },
  { grade: '4º Ano', amount: 2500, students: 55, avgPerStudent: 45.5 },
  { grade: '5º Ano', amount: 2100, students: 50, avgPerStudent: 42 },
  { grade: '6º Ano', amount: 3500, students: 60, avgPerStudent: 58.3 },
  { grade: '7º Ano', amount: 3800, students: 63, avgPerStudent: 60.3 },
  { grade: '8º Ano', amount: 3400, students: 58, avgPerStudent: 58.6 },
  { grade: '9º Ano', amount: 3200, students: 56, avgPerStudent: 57.1 }
];

interface ConsumptionAnalysisReportProps {
  schoolId?: string;
  className?: string;
}

export const ConsumptionAnalysisReport = ({ schoolId, className }: ConsumptionAnalysisReportProps) => {
  const [timeframe, setTimeframe] = useState('day');
  const [analysisType, setAnalysisType] = useState('byTime');
  
  // Formatador para valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
          <div>
            <CardTitle>Análise de Consumo dos Alunos</CardTitle>
            <CardDescription>Padrões de compras e transações por período</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="timeframe">Período:</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger id="timeframe" className="w-[140px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="analysisType">Visualização:</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger id="analysisType" className="w-[180px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="byTime">Por Horário</SelectItem>
                  <SelectItem value="byCategory">Por Categoria</SelectItem>
                  <SelectItem value="byGrade">Por Turma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {analysisType === 'byTime' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">Consumo por Horário ({timeframe === 'day' ? 'Hoje' : timeframe === 'week' ? 'Esta Semana' : 'Este Mês'})</div>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                    Transações: {consumptionByTimeOfDay.reduce((sum, item) => sum + item.transactions, 0)}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                    Volume: {formatCurrency(consumptionByTimeOfDay.reduce((sum, item) => sum + item.amount, 0))}
                  </Badge>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart
                  data={consumptionByTimeOfDay}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" angle={-45} textAnchor="end" height={50} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'amount') return formatCurrency(Number(value));
                      return value;
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="transactions" name="Transações" stroke="#0088FE" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="amount" name="Volume (R$)" stroke="#00C49F" />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
          
          {analysisType === 'byCategory' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">Consumo por Categoria ({timeframe === 'day' ? 'Hoje' : timeframe === 'week' ? 'Esta Semana' : 'Este Mês'})</div>
                <div>
                  <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                    Volume Total: {formatCurrency(consumptionByCategory.reduce((sum, item) => sum + item.value, 0))}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={consumptionByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {consumptionByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {consumptionByCategory.map((category, index) => (
                    <div key={category.name} className="flex justify-between items-center p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(category.value)}</div>
                        <div className="text-xs text-muted-foreground">{category.percentage}% do total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {analysisType === 'byGrade' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">Consumo por Série/Turma ({timeframe === 'day' ? 'Hoje' : timeframe === 'week' ? 'Esta Semana' : 'Este Mês'})</div>
                <div>
                  <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                    Média por Aluno: {formatCurrency(
                      consumptionByGrade.reduce((sum, item) => sum + item.amount, 0) / 
                      consumptionByGrade.reduce((sum, item) => sum + item.students, 0)
                    )}
                  </Badge>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={consumptionByGrade}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'amount') return formatCurrency(Number(value));
                      if (name === 'avgPerStudent') return formatCurrency(Number(value));
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Volume Total (R$)" fill="#8884d8" />
                  <Bar dataKey="avgPerStudent" name="Média por Aluno (R$)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

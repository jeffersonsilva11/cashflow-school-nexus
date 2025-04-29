
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Users, 
  School, 
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  dashboardStats, 
  transactionTrend, 
  schools, 
  recentTransactions 
} from '@/services/mockData';
import { formatCurrency } from '@/lib/format';

// Format date to display only the day and month
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(date);
};

// Function to determine if a change is positive
const isPositiveChange = (value: number) => value > 0;

// StatCard component for displaying key metrics
const StatCard = ({ 
  title, 
  value, 
  icon, 
  changeValue, 
  changeLabel 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  changeValue: number; 
  changeLabel: string; 
}) => {
  const isPositive = isPositiveChange(changeValue);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <ArrowUp size={16} className="mr-1" />
          ) : (
            <ArrowDown size={16} className="mr-1" />
          )}
          <span>{Math.abs(changeValue)}% {changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Transaction type pie chart data
const transactionTypeData = [
  { name: 'Compras', value: dashboardStats.transactionByType.purchase },
  { name: 'Recargas', value: dashboardStats.transactionByType.reload },
];

const COLORS = ['#0c9ceb', '#0365a1'];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'active') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Ativo</Badge>;
  } else if (status === 'pending') {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pendente</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inativo</Badge>;
  }
};

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema cashless para escolas.</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Escolas Ativas" 
          value={dashboardStats.activeSchools}
          icon={<School size={24} />}
          changeValue={dashboardStats.growthRate.schools}
          changeLabel="desde o mês passado"
        />
        <StatCard 
          title="Alunos Cadastrados" 
          value={dashboardStats.totalStudents}
          icon={<Users size={24} />}
          changeValue={8.3}
          changeLabel="desde o mês passado"
        />
        <StatCard 
          title="Transações Hoje" 
          value={dashboardStats.dailyTransactions}
          icon={<CreditCard size={24} />}
          changeValue={dashboardStats.growthRate.transactions}
          changeLabel="desde ontem"
        />
        <StatCard 
          title="Volume Mensal" 
          value={formatCurrency(dashboardStats.monthlyVolume)}
          icon={<DollarSign size={24} />}
          changeValue={dashboardStats.growthRate.volume}
          changeLabel="desde o mês passado"
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mt-6">
        {/* Transaction Trend Chart */}
        <Card className="lg:col-span-2">
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
                  data={transactionTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    formatter={(value) => [`R$ ${typeof value === 'number' ? value.toFixed(2) : value}`, 'Volume']}
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
        
        {/* Transaction Type Distribution */}
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
                    data={transactionTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {transactionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6">
                {transactionTypeData.map((entry, index) => (
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
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6">
        {/* Top Schools Table */}
        <Card>
          <CardHeader>
            <CardTitle>Escolas Mais Ativas</CardTitle>
            <CardDescription>
              Ranking das escolas com maior volume de transações
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escola</TableHead>
                  <TableHead className="text-right">Alunos</TableHead>
                  <TableHead className="text-right">Transações</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.slice(0, 5).map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{school.name}</p>
                        <p className="text-sm text-muted-foreground">{school.city}, {school.state}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{school.students}</TableCell>
                    <TableCell className="text-right">{school.transactions}</TableCell>
                    <TableCell className="text-right">{formatCurrency(school.volume)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Recent Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Últimas transações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.student}</p>
                        <p className="text-sm text-muted-foreground">{transaction.school}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'purchase' ? 'secondary' : 'default'}>
                        {transaction.type === 'purchase' ? 'Compra' : 'Recarga'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Users, 
  School, 
  DollarSign 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
      <CardContent className="stats-card">
        <div className="flex justify-between">
          <div>
            <p className="stats-label">{title}</p>
            <p className="stats-value">{value}</p>
            <div className={`stats-change ${isPositive ? 'stats-change-positive' : 'stats-change-negative'}`}>
              {isPositive ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span>{Math.abs(changeValue)}% {changeLabel}</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
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
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Tendência de Transações (Abr/2025)</h3>
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
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Distribuição de Transações</h3>
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
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Escolas Mais Ativas</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Escola</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Alunos</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Transações</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.slice(0, 5).map((school) => (
                    <tr key={school.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{school.name}</p>
                          <p className="text-sm text-muted-foreground">{school.city}, {school.state}</p>
                        </div>
                      </td>
                      <td className="py-3 text-right">{school.students}</td>
                      <td className="py-3 text-right">{school.transactions}</td>
                      <td className="py-3 text-right">{formatCurrency(school.volume)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Transactions Table */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Transações Recentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground">ID</th>
                    <th className="pb-2 font-medium text-muted-foreground">Data</th>
                    <th className="pb-2 font-medium text-muted-foreground">Aluno</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Valor</th>
                    <th className="pb-2 font-medium text-muted-foreground">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm font-mono">{transaction.id}</td>
                      <td className="py-3 text-sm">{formatDate(transaction.date)}</td>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{transaction.student}</p>
                          <p className="text-sm text-muted-foreground">{transaction.school}</p>
                        </div>
                      </td>
                      <td className="py-3 text-right">{formatCurrency(transaction.amount)}</td>
                      <td className="py-3">
                        <span 
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'purchase' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {transaction.type === 'purchase' ? 'Compra' : 'Recarga'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

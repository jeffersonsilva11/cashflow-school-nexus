
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Users, 
  School, 
  DollarSign
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { SchoolsTable } from '@/components/dashboard/SchoolsTable';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { TransactionTrendChart } from '@/components/dashboard/TransactionTrendChart';
import { TransactionTypePieChart } from '@/components/dashboard/TransactionTypePieChart';
import { 
  dashboardStats, 
  transactionTrend, 
  schools, 
  recentTransactions 
} from '@/services/mockData';
import { formatCurrency } from '@/lib/format';

// Transaction type pie chart data
const transactionTypeData = [
  { name: 'Compras', value: dashboardStats.transactionByType.purchase },
  { name: 'Recargas', value: dashboardStats.transactionByType.reload },
];

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
        <div className="lg:col-span-2">
          <TransactionTrendChart data={transactionTrend} />
        </div>
        
        {/* Transaction Type Distribution */}
        <div>
          <TransactionTypePieChart data={transactionTypeData} />
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-6">
        {/* Top Schools Table */}
        <SchoolsTable 
          schools={schools}
          title="Escolas Mais Ativas"
          description="Ranking das escolas com maior volume de transações"
        />
        
        {/* Recent Transactions Table */}
        <TransactionsTable 
          transactions={recentTransactions}
          title="Transações Recentes"
          description="Últimas transações realizadas no sistema"
        />
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionTrendChart } from "@/components/dashboard/TransactionTrendChart";
import { TransactionTypePieChart } from "@/components/dashboard/TransactionTypePieChart";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { SchoolsTable } from "@/components/dashboard/SchoolsTable";
import TransactionsLogWidget from "@/components/financial/TransactionsLogWidget"; 
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Users, School, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Sample data for charts and tables
  const transactionTrendData = [
    { date: '01/04', volume: 42000 },
    { date: '02/04', volume: 45000 },
    { date: '03/04', volume: 38000 },
    { date: '04/04', volume: 41000 },
    { date: '05/04', volume: 49000 },
    { date: '06/04', volume: 37000 },
    { date: '07/04', volume: 39000 },
    { date: '08/04', volume: 42000 },
    { date: '09/04', volume: 47000 },
    { date: '10/04', volume: 53000 },
  ];

  const transactionTypeData = [
    { name: 'Compras', value: 60 },
    { name: 'Recargas', value: 40 }
  ];

  const recentTransactions = [
    { id: '1', date: new Date(), student: 'Maria Silva', school: 'Escola Municipal São José', type: 'purchase', amount: 15.50, status: 'completed' },
    { id: '2', date: new Date(), student: 'João Oliveira', school: 'Escola Municipal São José', type: 'topup', amount: 50.00, status: 'completed' },
    { id: '3', date: new Date(), student: 'Ana Costa', school: 'Colégio Santo Agostinho', type: 'purchase', amount: 12.75, status: 'completed' },
    { id: '4', date: new Date(), student: 'Pedro Santos', school: 'Colégio Santo Agostinho', type: 'purchase', amount: 8.90, status: 'pending' },
    { id: '5', date: new Date(), student: 'Luiza Ferreira', school: 'Escola Municipal São José', type: 'topup', amount: 30.00, status: 'completed' },
  ];

  const topSchools = [
    { id: '1', name: 'Escola Municipal São José', city: 'São Paulo', state: 'SP', students: 1245, transactions: 8750, volume: 87500.00, status: 'active' },
    { id: '2', name: 'Colégio Santo Agostinho', city: 'Rio de Janeiro', state: 'RJ', students: 980, transactions: 7200, volume: 72000.00, status: 'active' },
    { id: '3', name: 'Escola Estadual Pedro II', city: 'Belo Horizonte', state: 'MG', students: 1100, transactions: 6850, volume: 68500.00, status: 'active' },
    { id: '4', name: 'Instituto Educacional Novo Tempo', city: 'Fortaleza', state: 'CE', students: 750, transactions: 4300, volume: 43000.00, status: 'active' },
    { id: '5', name: 'Colégio Objetivo', city: 'São Paulo', state: 'SP', students: 850, transactions: 5200, volume: 52000.00, status: 'active' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}! Aqui está um resumo do seu sistema.
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Transações Hoje"
          value="246" 
          trend="+12.5%" 
          description="Comparado a ontem" 
          icon={<CreditCard className="h-4 w-4" />}
        />
        
        <StatCard 
          title="Usuários Ativos"
          value="2,345" 
          trend="+3.1%" 
          description="Novos usuários esta semana" 
          icon={<Users className="h-4 w-4" />}
        />
        
        <StatCard 
          title="Escolas"
          value="42" 
          trend="0%" 
          description="Mesma quantidade da semana anterior" 
          icon={<School className="h-4 w-4" />}
        />
        
        <StatCard 
          title="Volume Financeiro"
          value="R$ 195.240,00" 
          trend="+24.5%" 
          description="Comparado ao mês passado" 
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-7 md:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg">Tendência de Transações</CardTitle>
            <CardDescription>
              Volume de transações nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <TransactionTrendChart data={transactionTrendData} />
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 space-y-4">
          <TransactionsLogWidget />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">        
        <Card className="col-span-7 md:col-span-4 lg:col-span-4">
          <Tabs defaultValue="recent">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Transações</CardTitle>
                <TabsList>
                  <TabsTrigger value="recent">Recentes</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Listagem das últimas transações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="recent" className="pt-4">
                <TransactionsTable 
                  transactions={recentTransactions} 
                  title="Transações Recentes"
                  description="Últimas transações realizadas"
                />
              </TabsContent>
              <TabsContent value="pending" className="pt-4">
                <TransactionsTable 
                  transactions={recentTransactions.filter(t => t.status === 'pending')} 
                  title="Transações Pendentes" 
                  description="Transações aguardando processamento"
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
        
        <div className="col-span-7 md:col-span-3 lg:col-span-3 grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Transação</CardTitle>
              <CardDescription>
                Distribuição por tipo de transação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionTypePieChart data={transactionTypeData} />
            </CardContent>
          </Card>
          
          {user?.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Escolas Ativas</CardTitle>
                <CardDescription>
                  Escolas com maior volume de transações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SchoolsTable 
                  schools={topSchools}
                  title="Escolas com Maior Volume"
                  description="Baseado nas transações dos últimos 30 dias"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

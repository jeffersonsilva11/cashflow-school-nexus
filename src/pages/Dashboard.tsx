
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/dashboard/StatCard";
import TransactionTrendChart from "@/components/dashboard/TransactionTrendChart";
import TransactionTypePieChart from "@/components/dashboard/TransactionTypePieChart";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import SchoolsTable from "@/components/dashboard/SchoolsTable";
import TransactionsLogWidget from "@/components/financial/TransactionsLogWidget"; 
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Users, School, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
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
            <TransactionTrendChart />
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
                <TransactionsTable />
              </TabsContent>
              <TabsContent value="pending" className="pt-4">
                <TransactionsTable type="pending" />
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
              <TransactionTypePieChart />
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
                <SchoolsTable />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

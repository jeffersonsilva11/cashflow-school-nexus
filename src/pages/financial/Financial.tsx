
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FinancialOverviewChart } from "@/components/financial/FinancialOverviewChart";
import { FinancialTrendChart } from "@/components/financial/FinancialTrendChart";
import { RevenueByPlanChart } from "@/components/financial/RevenueByPlanChart";
import TransactionsLogWidget from "@/components/financial/TransactionsLogWidget";
import { useFinancialOverview, useRevenueByPlan, useMonthlyTrend } from "@/services/financialReportHooks";

export default function Financial() {
  const { data: overviewData, isLoading: isOverviewLoading } = useFinancialOverview();
  const { data: revenueByPlanData, isLoading: isRevenueLoading } = useRevenueByPlan();
  const { data: monthlyTrendData, isLoading: isTrendLoading } = useMonthlyTrend();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Visão Geral Financeira</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho financeiro e tendências
        </p>
      </div>

      {/* Financial cards summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total (Mês Atual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {overviewData ? formatCurrency(overviewData.totalRevenueMonth) : 'Carregando...'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comissões (Mês Atual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {overviewData ? formatCurrency(overviewData.totalRevenueMonth * 0.1) : 'Carregando...'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Escolas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {overviewData ? overviewData.totalActiveSchools : 'Carregando...'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendências Mensais</CardTitle>
            <CardDescription>
              Receitas e comissões dos últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {!isTrendLoading && monthlyTrendData ? (
                <FinancialTrendChart data={monthlyTrendData} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Receita</CardTitle>
            <CardDescription>
              Receita por tipo de plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {!isRevenueLoading && revenueByPlanData ? (
                <RevenueByPlanChart data={revenueByPlanData} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visão Geral Financeira</CardTitle>
            <CardDescription>
              Distribuição geral de receitas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {!isOverviewLoading && overviewData?.monthlyData ? (
                <FinancialOverviewChart data={overviewData.monthlyData} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>
            Últimas transações registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsLogWidget limit={5} />
        </CardContent>
      </Card>
    </div>
  );
}

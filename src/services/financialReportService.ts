
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Interfaces base sem dependências circulares
export interface FinancialReportOverviewData {
  totalActiveSchools: number;
  totalRevenueMonth: number;
  totalActiveSubscriptions: number;
  totalPendingPayments: number;
  averageRevenuePerSchool: number;
  growthRate: number;
}

export interface RevenueByPlanItemData {
  plan: string;
  revenue: number;
  percentage: number;
}

export interface MonthlyTrendItemData {
  month: string;
  revenue: number;
}

// Interface composta usando os tipos base
export interface FinancialReportCompleteData {
  overview: FinancialReportOverviewData;
  revenueByPlan: RevenueByPlanItemData[];
  monthlyTrend: MonthlyTrendItemData[];
}

// Interface para relatórios financeiros
export interface FinancialReport {
  id: string;
  report_type: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  data: any; // Usando any para evitar problemas de inferência profunda
  created_at?: string;
  updated_at?: string;
}

// Buscar todos os relatórios financeiros
export async function fetchFinancialReports(): Promise<FinancialReport[]> {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as FinancialReport[];
  } catch (error) {
    console.error("Error fetching financial reports:", error);
    throw error;
  }
}

// Buscar relatórios financeiros por tipo
export async function fetchFinancialReportsByType(type: string): Promise<FinancialReport[]> {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as FinancialReport[];
  } catch (error) {
    console.error(`Error fetching financial reports of type ${type}:`, error);
    throw error;
  }
}

// Buscar o último relatório financeiro por tipo
export async function fetchLatestFinancialReport(type: string): Promise<FinancialReport | null> {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', type)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      if (error.code === 'PGRST116') { // Nenhuma linha retornada
        return null;
      }
      throw error;
    }
    return data as FinancialReport;
  } catch (error) {
    console.error(`Error fetching latest financial report of type ${type}:`, error);
    throw error;
  }
}

// Criar um novo relatório financeiro
export async function createFinancialReport(report: Omit<FinancialReport, 'id' | 'created_at' | 'updated_at'>): Promise<FinancialReport> {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return data as FinancialReport;
  } catch (error) {
    console.error("Error creating financial report:", error);
    throw error;
  }
}

// Atualizar um relatório financeiro
export async function updateFinancialReport(id: string, updates: Partial<FinancialReport>): Promise<FinancialReport> {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as FinancialReport;
  } catch (error) {
    console.error(`Error updating financial report ${id}:`, error);
    throw error;
  }
}

// Excluir um relatório financeiro
export async function deleteFinancialReport(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('financial_reports')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting financial report ${id}:`, error);
    throw error;
  }
}

// Gerar relatório de visão geral financeira
export async function generateFinancialOverviewReport(): Promise<FinancialReportOverviewData> {
  try {
    // Obter contagem de escolas ativas
    const { count: totalActiveSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);
    
    if (schoolsError) throw schoolsError;
    
    // Obter receita total das transações do mês atual
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const { data: monthTransactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', firstDayOfMonth.toISOString());
    
    if (transactionsError) throw transactionsError;
    
    const totalRevenueMonth = monthTransactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    
    // Obter contagem de assinaturas ativas
    const { count: totalActiveSubscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (subsError) throw subsError;
    
    // Obter pagamentos pendentes
    const { data: pendingInvoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('amount')
      .eq('status', 'pending');
    
    if (invoicesError) throw invoicesError;
    
    const totalPendingPayments = pendingInvoices?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0;
    
    // Calcular receita média por escola
    const averageRevenuePerSchool = totalActiveSchools > 0 
      ? totalRevenueMonth / totalActiveSchools 
      : 0;
    
    // Obter receita do mês anterior para cálculo de taxa de crescimento
    const previousMonth = new Date(firstDayOfMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    
    const { data: prevMonthTransactions, error: prevTransError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', previousMonth.toISOString())
      .lt('transaction_date', firstDayOfMonth.toISOString());
    
    if (prevTransError) throw prevTransError;
    
    const prevMonthRevenue = prevMonthTransactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    
    // Calcular taxa de crescimento
    const growthRate = prevMonthRevenue > 0 
      ? ((totalRevenueMonth - prevMonthRevenue) / prevMonthRevenue) * 100 
      : 0;
    
    return {
      totalActiveSchools: totalActiveSchools || 0,
      totalRevenueMonth,
      totalActiveSubscriptions: totalActiveSubscriptions || 0,
      totalPendingPayments,
      averageRevenuePerSchool,
      growthRate: parseFloat(growthRate.toFixed(1))
    };
  } catch (error) {
    console.error("Error generating financial overview report:", error);
    throw error;
  }
}

// Gerar relatório de receita por plano
export async function generateRevenueByPlanReport(): Promise<RevenueByPlanItemData[]> {
  try {
    // Obter todos os planos
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select('id, name');
    
    if (plansError) throw plansError;
    
    // Para cada plano, calcular a receita
    const revenueByPlanData: RevenueByPlanItemData[] = await Promise.all(
      plans.map(async (plan) => {
        // Obter escolas usando este plano
        const { data: schoolsWithPlan, error: schoolsError } = await supabase
          .from('schools')
          .select('id')
          .eq('subscription_plan', plan.name.toLowerCase());
        
        if (schoolsError) throw schoolsError;
        
        const schoolIds = schoolsWithPlan.map(school => school.id);
        
        if (schoolIds.length === 0) {
          return { plan: plan.name, revenue: 0, percentage: 0 };
        }
        
        // Obter transações dessas escolas no mês atual
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('amount')
          .in('school_id', schoolIds)
          .gte('transaction_date', firstDayOfMonth.toISOString());
        
        if (transactionsError) throw transactionsError;
        
        const revenue = transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
        
        return {
          plan: plan.name,
          revenue,
          percentage: 0 // Calcularemos as porcentagens depois de obter todas as receitas
        };
      })
    );
    
    // Calcular receita total
    const totalRevenue = revenueByPlanData.reduce((sum, item) => sum + item.revenue, 0);
    
    // Calcular porcentagens
    if (totalRevenue > 0) {
      revenueByPlanData.forEach(item => {
        item.percentage = parseFloat(((item.revenue / totalRevenue) * 100).toFixed(1));
      });
    }
    
    // Classificar por receita (decrescente)
    return revenueByPlanData.sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error("Error generating revenue by plan report:", error);
    throw error;
  }
}

// Gerar relatório de tendência mensal
export async function generateMonthlyTrendReport(months = 4): Promise<MonthlyTrendItemData[]> {
  try {
    const result: MonthlyTrendItemData[] = [];
    const currentDate = new Date();
    
    // Calcular para os últimos X meses
    for (let i = 0; i < months; i++) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentDate.getMonth() - i);
      
      const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount')
        .gte('transaction_date', firstDay.toISOString())
        .lte('transaction_date', lastDay.toISOString());
      
      if (error) throw error;
      
      const revenue = transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
      
      const month = monthDate.toLocaleString('pt-BR', {
        month: 'short',
        year: 'numeric'
      });
      
      result.unshift({
        month,
        revenue
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error generating monthly trend report:", error);
    throw error;
  }
}

// Gerar um relatório financeiro completo
export async function generateCompleteFinancialReport(): Promise<FinancialReportCompleteData> {
  try {
    const overview = await generateFinancialOverviewReport();
    const revenueByPlan = await generateRevenueByPlanReport();
    const monthlyTrend = await generateMonthlyTrendReport();
    
    return {
      overview,
      revenueByPlan,
      monthlyTrend
    };
  } catch (error) {
    console.error("Error generating complete financial report:", error);
    throw error;
  }
}

// React Query Hooks com tipos explícitos
export function useFinancialReports() {
  return useQuery<FinancialReport[], Error>({
    queryKey: ['financial-reports'],
    queryFn: fetchFinancialReports,
  });
}

export function useFinancialReportsByType(type: string) {
  return useQuery<FinancialReport[], Error>({
    queryKey: ['financial-reports', type],
    queryFn: () => fetchFinancialReportsByType(type),
  });
}

export function useLatestFinancialReport(type: string) {
  return useQuery<FinancialReport | null, Error>({
    queryKey: ['financial-reports', 'latest', type],
    queryFn: () => fetchLatestFinancialReport(type),
  });
}

export function useFinancialOverview() {
  return useQuery<FinancialReportOverviewData, Error>({
    queryKey: ['financial-overview'],
    queryFn: generateFinancialOverviewReport,
  });
}

export function useRevenueByPlan() {
  return useQuery<RevenueByPlanItemData[], Error>({
    queryKey: ['revenue-by-plan'],
    queryFn: generateRevenueByPlanReport,
  });
}

export function useMonthlyTrend() {
  return useQuery<MonthlyTrendItemData[], Error>({
    queryKey: ['monthly-trend'],
    queryFn: () => generateMonthlyTrendReport(),
  });
}

export function useCreateFinancialReport() {
  const queryClient = useQueryClient();
  
  return useMutation<
    FinancialReport, 
    Error, 
    Omit<FinancialReport, 'id' | 'created_at' | 'updated_at'>
  >({
    mutationFn: createFinancialReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', data.report_type] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', 'latest', data.report_type] });
      toast({ title: "Relatório financeiro criado com sucesso" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao criar relatório financeiro", 
        description: error.message || "Ocorreu um erro ao criar o relatório",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateFinancialReport() {
  const queryClient = useQueryClient();
  
  return useMutation<
    FinancialReport, 
    Error, 
    { id: string, updates: Partial<FinancialReport> }
  >({
    mutationFn: ({ id, updates }) => updateFinancialReport(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', data.report_type] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', 'latest', data.report_type] });
      toast({ title: "Relatório financeiro atualizado com sucesso" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar relatório financeiro", 
        description: error.message || "Ocorreu um erro ao atualizar o relatório",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteFinancialReport() {
  const queryClient = useQueryClient();
  
  return useMutation<boolean, Error, string>({
    mutationFn: deleteFinancialReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      toast({ title: "Relatório financeiro removido com sucesso" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao remover relatório financeiro", 
        description: error.message || "Ocorreu um erro ao remover o relatório",
        variant: "destructive" 
      });
    }
  });
}

import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Defina interfaces simples primeiro (sem auto-referência)
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

// Defina a interface completa usando os tipos primitivos
export interface FinancialReportCompleteData {
  overview: FinancialReportOverviewData;
  revenueByPlan: RevenueByPlanItemData[];
  monthlyTrend: MonthlyTrendItemData[];
}

// Defina o tipo FinancialReport separadamente
export interface FinancialReport {
  id: string;
  report_type: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  data: any;
  created_at?: string;
  updated_at?: string;
}

// Fetch all financial reports
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

// Fetch financial reports by type
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

// Fetch the latest financial report by type
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
      if (error.code === 'PGRST116') { // No rows returned
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

// Create a new financial report
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

// Update a financial report
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

// Delete a financial report
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

// Generate financial overview report
export async function generateFinancialOverviewReport(): Promise<FinancialReportOverviewData> {
  try {
    // Get active schools count
    const { count: totalActiveSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);
    
    if (schoolsError) throw schoolsError;
    
    // Get total revenue from transactions for current month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const { data: monthTransactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', firstDayOfMonth.toISOString());
    
    if (transactionsError) throw transactionsError;
    
    const totalRevenueMonth = monthTransactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    
    // Get active subscriptions count
    const { count: totalActiveSubscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (subsError) throw subsError;
    
    // Get pending payments
    const { data: pendingInvoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('amount')
      .eq('status', 'pending');
    
    if (invoicesError) throw invoicesError;
    
    const totalPendingPayments = pendingInvoices?.reduce((sum, invoice) => sum + (invoice.amount || 0), 0) || 0;
    
    // Calculate average revenue per school
    const averageRevenuePerSchool = totalActiveSchools > 0 
      ? totalRevenueMonth / totalActiveSchools 
      : 0;
    
    // Get previous month's revenue for growth rate calculation
    const previousMonth = new Date(firstDayOfMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    
    const { data: prevMonthTransactions, error: prevTransError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', previousMonth.toISOString())
      .lt('transaction_date', firstDayOfMonth.toISOString());
    
    if (prevTransError) throw prevTransError;
    
    const prevMonthRevenue = prevMonthTransactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    
    // Calculate growth rate
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

// Generate revenue by plan report
export async function generateRevenueByPlanReport(): Promise<RevenueByPlanItemData[]> {
  try {
    // Get all plans
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select('id, name');
    
    if (plansError) throw plansError;
    
    // For each plan, calculate the revenue
    const revenueByPlanData = await Promise.all(
      plans.map(async (plan) => {
        // Get schools using this plan
        const { data: schoolsWithPlan, error: schoolsError } = await supabase
          .from('schools')
          .select('id')
          .eq('subscription_plan', plan.name.toLowerCase());
        
        if (schoolsError) throw schoolsError;
        
        const schoolIds = schoolsWithPlan.map(school => school.id);
        
        if (schoolIds.length === 0) {
          return { plan: plan.name, revenue: 0, percentage: 0 };
        }
        
        // Get transactions for these schools in the current month
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
          percentage: 0 // Will calculate percentages after getting all revenues
        };
      })
    );
    
    // Calculate total revenue
    const totalRevenue = revenueByPlanData.reduce((sum, item) => sum + item.revenue, 0);
    
    // Calculate percentages
    if (totalRevenue > 0) {
      revenueByPlanData.forEach(item => {
        item.percentage = parseFloat(((item.revenue / totalRevenue) * 100).toFixed(1));
      });
    }
    
    // Sort by revenue (descending)
    return revenueByPlanData.sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error("Error generating revenue by plan report:", error);
    throw error;
  }
}

// Generate monthly trend report
export async function generateMonthlyTrendReport(months = 4): Promise<MonthlyTrendItemData[]> {
  try {
    const result: MonthlyTrendItemData[] = [];
    const currentDate = new Date();
    
    // Calculate for the last X months
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

// Generate a complete financial report
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

// React Query Hooks
export function useFinancialReports() {
  return useQuery({
    queryKey: ['financial-reports'],
    queryFn: fetchFinancialReports,
  });
}

export function useFinancialReportsByType(type: string) {
  return useQuery({
    queryKey: ['financial-reports', type],
    queryFn: () => fetchFinancialReportsByType(type),
  });
}

export function useLatestFinancialReport(type: string) {
  return useQuery({
    queryKey: ['financial-reports', 'latest', type],
    queryFn: () => fetchLatestFinancialReport(type),
  });
}

export function useFinancialOverview() {
  return useQuery({
    queryKey: ['financial-overview'],
    queryFn: generateFinancialOverviewReport,
  });
}

export function useRevenueByPlan() {
  return useQuery({
    queryKey: ['revenue-by-plan'],
    queryFn: generateRevenueByPlanReport,
  });
}

export function useMonthlyTrend() {
  return useQuery({
    queryKey: ['monthly-trend'],
    queryFn: () => generateMonthlyTrendReport(),
  });
}

export function useCreateFinancialReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFinancialReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', data.report_type] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', 'latest', data.report_type] });
      toast({ title: "Relatório financeiro criado com sucesso" });
    },
    onError: (error: any) => {
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
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<FinancialReport> }) => 
      updateFinancialReport(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', data.report_type] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', 'latest', data.report_type] });
      toast({ title: "Relatório financeiro atualizado com sucesso" });
    },
    onError: (error: any) => {
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
  
  return useMutation({
    mutationFn: deleteFinancialReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      toast({ title: "Relatório financeiro removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover relatório financeiro", 
        description: error.message || "Ocorreu um erro ao remover o relatório",
        variant: "destructive" 
      });
    }
  });
}

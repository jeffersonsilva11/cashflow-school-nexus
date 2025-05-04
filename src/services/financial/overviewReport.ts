
import { supabase } from "@/integrations/supabase/client";
import { FinancialReportOverviewData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { getMockOverviewData } from "./mock";

export const generateFinancialOverviewReport = async (): Promise<FinancialReportOverviewData> => {
  try {
    // Check if report exists in the database
    const report = await fetchFinancialReport('overview');
    
    if (report && report.data) {
      return report.data as FinancialReportOverviewData;
    }
    
    // Se não houver relatório no banco, buscar dados atuais do banco
    const { data: activeSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('count')
      .eq('active', true)
      .single();
      
    const { data: activeSubscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('count')
      .eq('status', 'active')
      .single();
      
    const { data: pendingInvoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('sum(amount)')
      .in('status', ['pending', 'overdue'])
      .single();
      
    const { data: recentTransactions, error: transError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())
      .eq('status', 'completed');
      
    // Se houver erro nas consultas, use dados mockados
    if (schoolsError || subsError || invoicesError || transError) {
      console.error("Error generating financial overview:", 
        schoolsError || subsError || invoicesError || transError);
      return getMockOverviewData();
    }
    
    // Calcular receita total das transações
    const totalRevenue = recentTransactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
    
    // Calcular média de receita por escola
    const avgRevenue = activeSchools && activeSchools.count > 0 ? 
      totalRevenue / activeSchools.count : 0;
    
    // Gerar dados de meses
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const monthlyData = months.map((month, idx) => ({
      month,
      revenue: Math.random() * 50000 + 30000 // Dado mockado para exemplo
    }));
    
    // Extração segura do valor sum da resposta
    const pendingAmount = pendingInvoices?.sum ? 
      (typeof pendingInvoices.sum === 'number' ? pendingInvoices.sum : 0) : 0;
    
    // Retornar relatório gerado
    return {
      totalRevenueMonth: totalRevenue,
      totalActiveSchools: activeSchools?.count || 0,
      totalActiveSubscriptions: activeSubscriptions?.count || 0,
      totalPendingPayments: pendingAmount,
      averageRevenuePerSchool: avgRevenue,
      growthRate: 8.5, // Exemplo fixo
      monthlyData
    };
  } catch (error) {
    console.error("Error in generateFinancialOverviewReport:", error);
    return getMockOverviewData();
  }
};

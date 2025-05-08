
import { supabase } from "@/integrations/supabase/client";
import { FinancialReportOverviewData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";

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
      
    // If there are database errors, return empty/zero values instead of mock data
    if (schoolsError || subsError || invoicesError || transError) {
      console.error("Error generating financial overview:", 
        schoolsError || subsError || invoicesError || transError);
      
      return {
        totalRevenueMonth: 0,
        totalActiveSchools: 0,
        totalActiveSubscriptions: 0,
        totalPendingPayments: 0,
        averageRevenuePerSchool: 0,
        growthRate: 0,
        monthlyData: []
      };
    }
    
    // Calculate total revenue from transactions
    const totalRevenue = recentTransactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
    
    // Calculate average revenue per school
    const avgRevenue = activeSchools && activeSchools.count > 0 ? 
      totalRevenue / activeSchools.count : 0;
    
    // Get monthly data from database or return empty array
    const { data: monthlyData, error: monthlyError } = await supabase
      .from('transactions')
      .select('amount, transaction_date')
      .eq('status', 'completed')
      .order('transaction_date', { ascending: true });
    
    // Format monthly data
    const formattedMonthlyData = !monthlyError && monthlyData ? 
      formatMonthlyData(monthlyData) : [];
    
    // Extract pending amount safely
    const pendingAmount = pendingInvoices?.sum ? 
      (typeof pendingInvoices.sum === 'number' ? pendingInvoices.sum : 0) : 0;
    
    // Return report with actual data
    return {
      totalRevenueMonth: totalRevenue,
      totalActiveSchools: activeSchools?.count || 0,
      totalActiveSubscriptions: activeSubscriptions?.count || 0,
      totalPendingPayments: pendingAmount,
      averageRevenuePerSchool: avgRevenue,
      growthRate: calculateGrowthRate(), // We'll implement this function below
      monthlyData: formattedMonthlyData
    };
  } catch (error) {
    console.error("Error in generateFinancialOverviewReport:", error);
    
    // Return empty data instead of mock data
    return {
      totalRevenueMonth: 0,
      totalActiveSchools: 0,
      totalActiveSubscriptions: 0,
      totalPendingPayments: 0,
      averageRevenuePerSchool: 0,
      growthRate: 0,
      monthlyData: []
    };
  }
};

// Helper function to format monthly data
function formatMonthlyData(data: any[]): { month: string, revenue: number }[] {
  if (!data || data.length === 0) {
    return [];
  }
  
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthlyRevenue = new Map<string, number>();
  
  // Group transactions by month
  data.forEach(item => {
    if (!item.transaction_date || !item.amount) return;
    
    const date = new Date(item.transaction_date);
    const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
    
    const currentAmount = monthlyRevenue.get(monthKey) || 0;
    monthlyRevenue.set(monthKey, currentAmount + item.amount);
  });
  
  // Convert map to array and sort by date
  return Array.from(monthlyRevenue.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });
}

// Simple function to calculate growth rate - could be enhanced with real calculations
function calculateGrowthRate(): number {
  // In a real implementation, you would compare current period to previous period
  // For now, return 0 instead of a hard-coded growth rate
  return 0;
}

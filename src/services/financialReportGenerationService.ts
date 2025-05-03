
import { supabase } from "@/integrations/supabase/client";
import {
  FinancialReportOverviewData,
  RevenueByPlanItemData,
  MonthlyTrendItemData,
  FinancialReportCompleteData
} from './financialReportTypes';

// Function to generate a financial overview report
export async function generateFinancialOverviewReport(): Promise<FinancialReportOverviewData> {
  try {
    // Get count of active schools
    const { count: totalActiveSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);
    
    if (schoolsError) throw schoolsError;
    
    // Get total revenue from transactions for the current month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const { data: monthTransactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', firstDayOfMonth.toISOString());
    
    if (transactionsError) throw transactionsError;
    
    const totalRevenueMonth = monthTransactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    
    // Get count of active subscriptions
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
    const averageRevenuePerSchool = totalActiveSchools && totalActiveSchools > 0 
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

// Function to generate a revenue by plan report
export async function generateRevenueByPlanReport(): Promise<RevenueByPlanItemData[]> {
  try {
    // Get all plans
    const { data: plans, error: plansError } = await supabase
      .from('plans')
      .select('id, name');
    
    if (plansError) throw plansError;
    
    if (!plans || plans.length === 0) {
      return [];
    }
    
    // For each plan, calculate revenue
    const revenueByPlanData: RevenueByPlanItemData[] = [];
    
    for (const plan of plans) {
      // Get schools using this plan
      const { data: schoolsWithPlan, error: schoolsError } = await supabase
        .from('schools')
        .select('id')
        .eq('subscription_plan', plan.name.toLowerCase());
      
      if (schoolsError) throw schoolsError;
      
      // Use type assertion to avoid deep instantiation
      const schoolIds = schoolsWithPlan 
        ? (schoolsWithPlan as Array<{id: string}>).map(school => school.id) 
        : [];
      
      if (schoolIds.length === 0) {
        revenueByPlanData.push({ plan: plan.name, revenue: 0, percentage: 0 });
        continue;
      }
      
      // Get transactions from these schools in the current month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      
      // Using a safer approach that doesn't trigger deep instantiation
      let revenue = 0;
      
      if (schoolIds.length > 0) {
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('amount')
          .in('school_id', schoolIds)
          .gte('transaction_date', firstDayOfMonth.toISOString());
        
        if (transactionsError) throw transactionsError;
        
        if (transactions) {
          for (const tx of transactions) {
            revenue += (tx.amount || 0);
          }
        }
      }
      
      revenueByPlanData.push({
        plan: plan.name,
        revenue,
        percentage: 0 // Percentages calculated after all revenue totals are known
      });
    }
    
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

// Function to generate a monthly trend report
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

// Function to generate a complete financial report
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

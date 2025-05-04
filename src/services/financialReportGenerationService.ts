
import { supabase } from "@/integrations/supabase/client";
import { 
  FinancialReportOverviewData,
  RevenueByPlanItemData,
  MonthlyTrendItemData,
  ConsumptionAnalysisItemData,
  ConsumptionAnalysis,
  MonthlyTrend,
  RevenueByPlan 
} from "./financialReportTypes";
import { financialReports } from "./financialMockData";

// Function to fetch financial reports from the database
export const fetchFinancialReport = async (reportType: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', reportType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error(`Error fetching ${reportType} report:`, error);
      // Retornar dados mockados em caso de erro
      if (reportType === 'overview') {
        return { data: financialReports.overview };
      } else if (reportType === 'revenue_by_plan') {
        return { data: financialReports.revenueByPlan };
      } else if (reportType === 'monthly_trend') {
        return { data: financialReports.monthlyTrend };
      }
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in fetchFinancialReport for ${reportType}:`, error);
    // Fallback para dados mockados
    return null;
  }
};

// Function to fetch consumption analysis data
export const fetchConsumptionAnalysis = async (reportDate: Date = new Date()): Promise<ConsumptionAnalysis[]> => {
  try {
    const { data, error } = await supabase
      .from('consumption_analysis')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('report_date', reportDate.toISOString().split('T')[0]);
    
    if (error) {
      console.error("Error fetching consumption analysis:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchConsumptionAnalysis:", error);
    return [];
  }
};

// Function to fetch monthly trends data
export const fetchMonthlyTrends = async (monthsBack: number = 6): Promise<MonthlyTrend[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);
    
    const { data, error } = await supabase
      .from('monthly_trends')
      .select('*')
      .order('year', { ascending: true })
      .order('month', { ascending: true });
    
    if (error) {
      console.error("Error fetching monthly trends:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchMonthlyTrends:", error);
    return [];
  }
};

// Function to fetch revenue by plan data
export const fetchRevenueByPlan = async (reportDate: Date = new Date()): Promise<RevenueByPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('revenue_by_plan')
      .select('*')
      .eq('report_date', reportDate.toISOString().split('T')[0]);
    
    if (error) {
      console.error("Error fetching revenue by plan:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchRevenueByPlan:", error);
    return [];
  }
};

// Generate financial reports
export const generateFinancialOverviewReport = async (): Promise<FinancialReportOverviewData> => {
  try {
    // Check if report exists in the database
    const report = await fetchFinancialReport('overview');
    
    if (report && report.data) {
      // Se temos dados reais no banco, use-os
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
      return financialReports.overview;
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
    return financialReports.overview;
  }
};

// Generate revenue by plan report
export const generateRevenueByPlanReport = async (): Promise<RevenueByPlanItemData[]> => {
  try {
    // Check if report exists
    const report = await fetchFinancialReport('revenue_by_plan');
    
    if (report && report.data) {
      return report.data;
    }
    
    // Tentar buscar dados reais do banco
    const { data: revByPlan, error } = await supabase
      .from('revenue_by_plan')
      .select('*')
      .order('revenue', { ascending: false })
      .limit(5);
      
    if (error || !revByPlan || revByPlan.length === 0) {
      console.error("Error or no data for revenue by plan:", error);
      return financialReports.revenueByPlan;
    }
    
    // Converter para o formato necessário, adicionando os campos name e value que estavam faltando
    return revByPlan.map(item => ({
      name: item.plan_name,
      value: item.revenue,
      plan: item.plan_name,
      revenue: item.revenue,
      percentage: item.percentage
    }));
  } catch (error) {
    console.error("Error in generateRevenueByPlanReport:", error);
    return financialReports.revenueByPlan;
  }
};

// Generate monthly trend report
export const generateMonthlyTrendReport = async (): Promise<MonthlyTrendItemData[]> => {
  try {
    // Check if report exists
    const report = await fetchFinancialReport('monthly_trend');
    
    if (report && report.data) {
      return report.data;
    }
    
    // Tentar buscar dados reais do banco
    const { data: monthlyData, error } = await supabase
      .from('monthly_trends')
      .select('*')
      .order('year', { ascending: true })
      .order('month', { ascending: true });
      
    if (error || !monthlyData || monthlyData.length === 0) {
      console.error("Error or no data for monthly trends:", error);
      return financialReports.monthlyTrend;
    }
    
    // Converter para o formato necessário
    return monthlyData.map(item => ({
      month: `${item.month} ${item.year}`,
      revenue: item.revenue
    }));
  } catch (error) {
    console.error("Error in generateMonthlyTrendReport:", error);
    return financialReports.monthlyTrend;
  }
};

// Generate consumption analysis report
export const generateConsumptionAnalysisReport = async (): Promise<ConsumptionAnalysisItemData[]> => {
  try {
    // Tentar buscar dados reais do banco
    const { data: consumptionData, error } = await supabase
      .from('consumption_analysis')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('amount', { ascending: false })
      .limit(10);
      
    if (error || !consumptionData || consumptionData.length === 0) {
      console.error("Error or no data for consumption analysis:", error);
      
      // Gerar dados mockados
      const mockConsumptionData: ConsumptionAnalysisItemData[] = [
        {
          schoolId: "1",
          schoolName: "Colégio Integrado",
          productType: "Lanches",
          amount: 8750.50,
          quantity: 1250,
          studentCount: 350,
          averagePerStudent: 25.00
        },
        {
          schoolId: "2",
          schoolName: "Escola Maria Eduarda",
          productType: "Refeições",
          amount: 12540.75,
          quantity: 980,
          studentCount: 290,
          averagePerStudent: 43.24
        },
        {
          schoolId: "3",
          schoolName: "Colégio São Pedro",
          productType: "Bebidas",
          amount: 3250.25,
          quantity: 850,
          studentCount: 210,
          averagePerStudent: 15.48
        }
      ];
      
      return mockConsumptionData;
    }
    
    // Converter para o formato necessário
    return consumptionData.map(item => ({
      schoolId: item.school_id,
      schoolName: item.school?.name || "Escola não especificada",
      productType: item.product_type,
      amount: item.amount,
      quantity: item.quantity,
      studentCount: item.student_count,
      averagePerStudent: item.average_per_student
    }));
  } catch (error) {
    console.error("Error in generateConsumptionAnalysisReport:", error);
    
    // Retornar dados mockados em caso de erro
    const mockConsumptionData: ConsumptionAnalysisItemData[] = [
      {
        schoolId: "1",
        schoolName: "Colégio Integrado",
        productType: "Lanches",
        amount: 8750.50,
        quantity: 1250,
        studentCount: 350,
        averagePerStudent: 25.00
      },
      {
        schoolId: "2",
        schoolName: "Escola Maria Eduarda",
        productType: "Refeições",
        amount: 12540.75,
        quantity: 980,
        studentCount: 290,
        averagePerStudent: 43.24
      },
      {
        schoolId: "3",
        schoolName: "Colégio São Pedro",
        productType: "Bebidas",
        amount: 3250.25,
        quantity: 850,
        studentCount: 210,
        averagePerStudent: 15.48
      }
    ];
    
    return mockConsumptionData;
  }
};

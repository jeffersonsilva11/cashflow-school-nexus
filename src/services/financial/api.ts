
import { supabase } from "@/integrations/supabase/client";
import { ConsumptionAnalysis, MonthlyTrend, RevenueByPlan } from "../financialReportTypes";

// Função para buscar relatórios financeiros do banco de dados
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
      // Retornaremos null e deixaremos o serviço específico lidar com os dados mockados
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in fetchFinancialReport for ${reportType}:`, error);
    return null;
  }
};

// Função para buscar dados de análise de consumo
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

// Função para buscar dados de tendências mensais
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

// Função para buscar dados de receita por plano
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

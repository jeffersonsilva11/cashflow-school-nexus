
import { MonthlyTrendItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";
import { getMockMonthlyTrendData } from "./mock";

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
      return getMockMonthlyTrendData();
    }
    
    // Converter para o formato necessário
    return monthlyData.map(item => ({
      month: `${item.month} ${item.year}`,
      revenue: item.revenue
    }));
  } catch (error) {
    console.error("Error in generateMonthlyTrendReport:", error);
    return getMockMonthlyTrendData();
  }
};

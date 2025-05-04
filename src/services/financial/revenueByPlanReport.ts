
import { RevenueByPlanItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";
import { getMockRevenueByPlanData } from "./mock";

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
      return getMockRevenueByPlanData();
    }
    
    // Converter para o formato necessário, adicionando os campos name e value que são exigidos
    return revByPlan.map(item => ({
      name: item.plan_name,
      value: item.revenue,
      plan: item.plan_name,
      revenue: item.revenue,
      percentage: item.percentage
    }));
  } catch (error) {
    console.error("Error in generateRevenueByPlanReport:", error);
    return getMockRevenueByPlanData();
  }
};

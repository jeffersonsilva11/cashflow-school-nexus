
import { RevenueByPlanItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";

export const generateRevenueByPlanReport = async (): Promise<RevenueByPlanItemData[]> => {
  try {
    // Check if report exists
    const report = await fetchFinancialReport('revenue_by_plan');
    
    if (report && report.data) {
      return report.data;
    }
    
    // Try to get real data from the database
    const { data: revByPlan, error } = await supabase
      .from('revenue_by_plan')
      .select('*')
      .order('revenue', { ascending: false })
      .limit(5);
      
    if (error) {
      console.error("Error fetching revenue by plan data:", error);
      return []; // Return empty array instead of mock data
    }
      
    // If no data found, return empty array
    if (!revByPlan || revByPlan.length === 0) {
      console.info("No revenue by plan data found in database");
      return [];
    }
    
    // Convert to the format needed, adding name and value fields
    return revByPlan.map(item => ({
      name: item.plan_name,
      value: item.revenue,
      plan: item.plan_name,
      revenue: item.revenue,
      percentage: item.percentage
    }));
  } catch (error) {
    console.error("Error in generateRevenueByPlanReport:", error);
    return []; // Return empty array instead of mock data
  }
};

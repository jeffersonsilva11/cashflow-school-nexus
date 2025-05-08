
import { MonthlyTrendItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";

export const generateMonthlyTrendReport = async (): Promise<MonthlyTrendItemData[]> => {
  try {
    // Check if report exists
    const report = await fetchFinancialReport('monthly_trend');
    
    if (report && report.data) {
      return report.data;
    }
    
    // Try to get real data from the database
    const { data: monthlyData, error } = await supabase
      .from('monthly_trends')
      .select('*')
      .order('year', { ascending: true })
      .order('month', { ascending: true });
      
    if (error) {
      console.error("Error fetching monthly trends data:", error);
      return []; // Return empty array instead of mock data
    }
      
    // If no data found, return empty array
    if (!monthlyData || monthlyData.length === 0) {
      console.info("No monthly trend data found in database");
      return [];
    }
    
    // Convert to the format necessary
    return monthlyData.map(item => ({
      month: `${item.month} ${item.year}`,
      revenue: item.revenue
    }));
  } catch (error) {
    console.error("Error in generateMonthlyTrendReport:", error);
    return []; // Return empty array instead of mock data
  }
};

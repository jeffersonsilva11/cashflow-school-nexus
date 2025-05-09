
import { MonthlyTrendItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";

export const generateMonthlyTrendReport = async (vendorId?: string): Promise<MonthlyTrendItemData[]> => {
  try {
    // Se não for especificado um vendorId, verificamos se existe um relatório geral
    if (!vendorId) {
      const report = await fetchFinancialReport('monthly_trend');
      
      if (report && report.data) {
        return report.data;
      }
    }
    
    // Consultamos dados de vendas por mês
    let query = supabase
      .from('transactions')
      .select(`
        transaction_date,
        amount
      `)
      .eq('status', 'completed')
      .order('transaction_date', { ascending: true });
      
    // Se um vendorId for especificado, filtramos por esse vendedor
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching monthly trends data:", error);
      return [];
    }
      
    // Se não encontramos dados, retornamos array vazio
    if (!data || data.length === 0) {
      console.info("No monthly trend data found");
      return [];
    }
    
    // Agrupamos dados por mês
    const monthlyData: Record<string, number> = {};
    
    data.forEach(item => {
      const date = new Date(item.transaction_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      
      monthlyData[monthYear] += Number(item.amount);
    });
    
    // Convertemos para o formato esperado
    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }));
  } catch (error) {
    console.error("Error in generateMonthlyTrendReport:", error);
    return [];
  }
};

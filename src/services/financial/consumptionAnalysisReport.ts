
import { ConsumptionAnalysisItemData } from "../financialReportTypes";
import { supabase } from "@/integrations/supabase/client";

export const generateConsumptionAnalysisReport = async (): Promise<ConsumptionAnalysisItemData[]> => {
  try {
    // Try to get real data from the database
    const { data: consumptionData, error } = await supabase
      .from('consumption_analysis')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('amount', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error("Error fetching consumption analysis data:", error);
      return []; // Return empty array instead of mock data
    }
      
    // If no data found, return empty array
    if (!consumptionData || consumptionData.length === 0) {
      console.info("No consumption analysis data found in database");
      return [];
    }
    
    // Convert to the format necessary
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
    return []; // Return empty array instead of mock data
  }
};

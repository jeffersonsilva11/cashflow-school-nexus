
import { ConsumptionAnalysisItemData } from "../financialReportTypes";
import { supabase } from "@/integrations/supabase/client";
import { getMockConsumptionAnalysisData } from "./mock";

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
      return getMockConsumptionAnalysisData();
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
    return getMockConsumptionAnalysisData();
  }
};

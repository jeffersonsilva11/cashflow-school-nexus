
import { ConsumptionAnalysisItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";
import { 
  ConsumptionAnalysisRecord, 
  ConsumptionAnalysisItemOutput 
} from "./types/consumptionTypes";
import { generateConsumptionDataFromTransactions } from "./utils/transactionConsumptionGenerator";

/**
 * Generates a consumption analysis report for vendors or the entire platform
 * @param vendorId Optional vendor ID to filter results by vendor
 * @returns List of consumption analysis items
 */
export const generateConsumptionAnalysisReport = async (vendorId?: string): Promise<ConsumptionAnalysisItemData[]> => {
  try {
    // If no vendorId is specified, check if a general report exists
    if (!vendorId) {
      const report = await fetchFinancialReport('consumption_analysis');
      
      if (report && report.data) {
        return report.data;
      }
    }
    
    // Get consumption data from database
    const consumptionData = await fetchConsumptionData(vendorId);
    
    // If no data found, generate data from transactions
    if (!consumptionData || consumptionData.length === 0) {
      return vendorId ? 
        await generateConsumptionDataFromTransactions(vendorId) :
        await generateConsumptionDataFromTransactions();
    }
    
    // Get school names for the consumption data
    const schoolsData = await fetchSchoolsData(consumptionData);
    
    // Combine the data into the final report format
    return formatConsumptionReport(consumptionData, schoolsData, vendorId);
    
  } catch (error) {
    console.error("Error in generateConsumptionAnalysisReport:", error);
    return [];
  }
};

/**
 * Fetches raw consumption analysis data
 */
async function fetchConsumptionData(vendorId?: string): Promise<ConsumptionAnalysisRecord[]> {
  // Using "as any" to break the type inference that's causing the problem
  const query = supabase
    .from('consumption_analysis')
    .select('*') as any;
    
  // Apply filters and ordering after the "as any"
  // to avoid type inference issues
  const queryWithFilters = query
    .order('amount', { ascending: false })
    .limit(20);
  
  if (vendorId) {
    queryWithFilters.eq('vendor_id', vendorId);
  }
  
  // Using any here as well to break inference
  const { data, error } = await queryWithFilters;
  
  if (error) {
    console.error("Error fetching consumption analysis data:", error);
    return [];
  }
  
  return (data || []) as ConsumptionAnalysisRecord[];
}

/**
 * Fetches school name data for the given consumption records
 */
async function fetchSchoolsData(consumptionData: ConsumptionAnalysisRecord[]): Promise<Record<string, string>> {
  const schoolsData: Record<string, string> = {};
  const schoolIds = consumptionData.map(item => item.school_id).filter(Boolean);
  
  if (schoolIds.length > 0) {
    // Using "as any" to break the type inference
    const query = supabase
      .from('schools')
      .select('id, name') as any;
      
    const { data: schools } = await query.in('id', schoolIds);
    
    if (schools) {
      schools.forEach((school: any) => {
        schoolsData[school.id] = school.name;
      });
    }
  }
  
  return schoolsData;
}

/**
 * Formats consumption data into the required response format
 */
function formatConsumptionReport(
  consumptionData: ConsumptionAnalysisRecord[],
  schoolsData: Record<string, string>,
  vendorId?: string
): ConsumptionAnalysisItemData[] {
  // Use explicit intermediate type to avoid circular references
  const formattedItems: ConsumptionAnalysisItemOutput[] = consumptionData.map(item => ({
    schoolId: item.school_id,
    schoolName: schoolsData[item.school_id] || 'Escola não informada',
    productType: item.product_type,
    amount: item.amount,
    quantity: item.quantity,
    studentCount: item.student_count,
    averagePerStudent: item.average_per_student,
    vendorId: vendorId || '',
    vendorName: vendorId ? 'Cantina específica' : 'Cantina sem nome'
  }));
  
  // Cast to expected return type after formatting
  return formattedItems as ConsumptionAnalysisItemData[];
}


import { ConsumptionAnalysisItemData } from "../../financialReportTypes";
import { supabase } from "@/integrations/supabase/client";
import { TransactionRecord, SchoolRecord, StudentRecord, VendorRecord } from "../types/consumptionTypes";

/**
 * Generates consumption analysis data from transactions when no report data is available
 */
export const generateConsumptionDataFromTransactions = async (vendorId?: string): Promise<ConsumptionAnalysisItemData[]> => {
  try {
    // 1. First, query the transactions
    let transactionsRaw: TransactionRecord[] = [];
    
    {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('type', 'purchase')
        .eq('status', 'completed');
      
      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
      }
      
      const { data, error } = await query;
      
      if (error || !data || data.length === 0) {
        console.warn("No transactions found for consumption analysis");
        return [];
      }
      
      transactionsRaw = data as TransactionRecord[];
    }
    
    // 2. Collect student and vendor IDs for separate queries
    const studentIds = Array.from(new Set(transactionsRaw.map(tx => tx.student_id).filter(Boolean)));
    const vendorIds = Array.from(new Set(transactionsRaw.map(tx => tx.vendor_id).filter(Boolean)));
    
    // 3. Get student information
    const studentSchoolMap = await fetchStudentSchoolMap(studentIds);
    
    // 4. Get vendor information
    const vendorMap = await fetchVendorMap(vendorIds);
    
    // 5. Group transactions by school
    const schoolTransactionsMap = groupTransactionsBySchool(
      transactionsRaw, 
      studentSchoolMap, 
      vendorMap
    );
    
    // 6. Get school names
    const schoolIds = Object.keys(schoolTransactionsMap);
    const schoolNames = await fetchSchoolNames(schoolIds);
    
    // 7. Count students per school
    const studentCounts = await countStudentsBySchool(schoolIds);
    
    // 8. Format the final result
    return formatConsumptionResults(
      schoolTransactionsMap,
      schoolNames,
      studentCounts
    );
    
  } catch (error) {
    console.error("Error generating consumption data from transactions:", error);
    return [];
  }
};

// Helper function to fetch student-to-school mapping
async function fetchStudentSchoolMap(studentIds: string[]): Promise<Record<string, string>> {
  const studentSchoolMap: Record<string, string> = {};
  
  if (studentIds.length > 0) {
    const { data: students } = await supabase
      .from('students')
      .select('id, school_id')
      .in('id', studentIds);
    
    if (students) {
      students.forEach(student => {
        if (student.id && student.school_id) {
          studentSchoolMap[student.id] = student.school_id;
        }
      });
    }
  }
  
  return studentSchoolMap;
}

// Helper function to fetch vendor information
async function fetchVendorMap(vendorIds: string[]): Promise<Record<string, VendorRecord>> {
  const vendorMap: Record<string, VendorRecord> = {};
  
  if (vendorIds.length > 0) {
    const { data: vendors } = await supabase
      .from('vendors')
      .select('id, name, type')
      .in('id', vendorIds);
    
    if (vendors) {
      vendors.forEach(vendor => {
        vendorMap[vendor.id] = vendor as VendorRecord;
      });
    }
  }
  
  return vendorMap;
}

// Helper function to group transactions by school
function groupTransactionsBySchool(
  transactions: TransactionRecord[],
  studentSchoolMap: Record<string, string>,
  vendorMap: Record<string, VendorRecord>
): Record<string, {
  totalAmount: number;
  totalQuantity: number;
  schoolId: string;
  vendorId: string;
  vendorName: string;
}> {
  const schoolTransactionsMap: Record<string, {
    totalAmount: number;
    totalQuantity: number;
    schoolId: string;
    vendorId: string;
    vendorName: string;
  }> = {};
  
  for (const tx of transactions) {
    const studentId = tx.student_id;
    if (!studentId) continue;
    
    const schoolId = studentSchoolMap[studentId];
    if (!schoolId) continue;
    
    if (!schoolTransactionsMap[schoolId]) {
      const vendor = vendorMap[tx.vendor_id];
      
      schoolTransactionsMap[schoolId] = {
        totalAmount: 0,
        totalQuantity: 0,
        schoolId,
        vendorId: tx.vendor_id || '',
        vendorName: vendor?.name || 'Cantina sem nome'
      };
    }
    
    const schoolData = schoolTransactionsMap[schoolId];
    schoolData.totalAmount += Number(tx.amount);
    schoolData.totalQuantity += 1;
  }
  
  return schoolTransactionsMap;
}

// Helper function to fetch school names
async function fetchSchoolNames(schoolIds: string[]): Promise<Record<string, string>> {
  const schoolNames: Record<string, string> = {};
  
  if (schoolIds.length > 0) {
    const { data: schools } = await supabase
      .from('schools')
      .select('id, name')
      .in('id', schoolIds);
    
    if (schools) {
      schools.forEach(school => {
        schoolNames[school.id] = school.name;
      });
    }
  }
  
  return schoolNames;
}

// Helper function to count students by school
async function countStudentsBySchool(schoolIds: string[]): Promise<Record<string, number>> {
  const studentCounts: Record<string, number> = {};
  
  for (const schoolId of schoolIds) {
    const { count } = await supabase
      .from('students')
      .select('id', { count: 'exact', head: true })
      .eq('school_id', schoolId)
      .eq('active', true);
    
    studentCounts[schoolId] = count || 0;
  }
  
  return studentCounts;
}

// Helper function to format final consumption results
function formatConsumptionResults(
  schoolTransactionsMap: Record<string, {
    totalAmount: number;
    totalQuantity: number;
    schoolId: string;
    vendorId: string;
    vendorName: string;
  }>,
  schoolNames: Record<string, string>,
  studentCounts: Record<string, number>
): ConsumptionAnalysisItemData[] {
  return Object.values(schoolTransactionsMap).map(data => {
    const studentCount = studentCounts[data.schoolId] || 1;
    
    return {
      schoolId: data.schoolId,
      schoolName: schoolNames[data.schoolId] || 'Escola não informada',
      productType: 'Diversos', // Group everything as miscellaneous in this case
      amount: data.totalAmount,
      quantity: data.totalQuantity,
      studentCount,
      averagePerStudent: data.totalAmount / studentCount,
      vendorId: data.vendorId,
      vendorName: data.vendorName
    };
  });
}

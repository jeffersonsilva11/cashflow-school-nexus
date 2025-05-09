
import { ConsumptionAnalysisItemData } from "../financialReportTypes";
import { supabase } from "@/integrations/supabase/client";

export const generateConsumptionAnalysisReport = async (vendorId?: string): Promise<ConsumptionAnalysisItemData[]> => {
  try {
    // Construímos a query base
    let query = supabase
      .from('transactions')
      .select(`
        id,
        amount,
        vendor:vendor_id (
          id,
          name,
          type,
          location,
          school:school_id (
            id,
            name
          )
        ),
        student:student_id (
          id,
          name,
          school:school_id (
            id,
            name
          )
        )
      `)
      .eq('type', 'purchase')
      .eq('status', 'completed');

    // Se um vendorId for especificado, filtramos por esse vendedor
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    
    const { data: transactions, error } = await query;
      
    if (error) {
      console.error("Error fetching consumption analysis data:", error);
      return [];
    }
      
    if (!transactions || transactions.length === 0) {
      console.info("No consumption analysis data found");
      return [];
    }
    
    // Agrupamos dados por escola e cantina
    const schoolVendorMap: Record<string, {
      schoolId: string,
      schoolName: string,
      vendorId: string,
      vendorName: string,
      productType: string,
      amount: number,
      quantity: number,
      studentCount: Set<string>
    }> = {};
    
    transactions.forEach(transaction => {
      const schoolId = transaction.student?.school?.id || transaction.vendor?.school?.id || 'unknown';
      const schoolName = transaction.student?.school?.name || transaction.vendor?.school?.name || 'Escola não especificada';
      const vendorId = transaction.vendor?.id || 'unknown';
      const vendorName = transaction.vendor?.name || 'Cantina não especificada';
      const studentId = transaction.student?.id;
      
      // Chave composta para agrupar por escola e cantina
      const key = `${schoolId}-${vendorId}`;
      
      if (!schoolVendorMap[key]) {
        schoolVendorMap[key] = {
          schoolId,
          schoolName,
          vendorId,
          vendorName,
          productType: transaction.vendor?.type === 'own' ? 'Cantina Própria' : 'Cantina Terceirizada',
          amount: 0,
          quantity: 0,
          studentCount: new Set()
        };
      }
      
      schoolVendorMap[key].amount += Number(transaction.amount);
      schoolVendorMap[key].quantity += 1;
      
      if (studentId) {
        schoolVendorMap[key].studentCount.add(studentId);
      }
    });
    
    // Convertemos o mapa em um array no formato esperado
    return Object.values(schoolVendorMap).map(item => ({
      schoolId: item.schoolId,
      schoolName: item.schoolName,
      productType: item.productType,
      amount: item.amount,
      quantity: item.quantity,
      studentCount: item.studentCount.size,
      averagePerStudent: item.studentCount.size > 0 ? item.amount / item.studentCount.size : 0,
      vendorId: item.vendorId,
      vendorName: item.vendorName
    }));
  } catch (error) {
    console.error("Error in generateConsumptionAnalysisReport:", error);
    return [];
  }
};

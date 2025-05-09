
import { ConsumptionAnalysisItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";

// Define explicit interfaces to avoid recursive type inference
interface ConsumptionAnalysisRecord {
  id: string;
  school_id: string;
  product_type: string;
  amount: number;
  quantity: number;
  student_count: number;
  average_per_student: number;
  report_date: string;
  created_at: string;
  updated_at: string;
  school?: {
    name: string;
  };
}

interface TransactionRecord {
  id: string;
  amount: number;
  vendor_id: string;
  student_id: string;
  status: string;
  type: string;
  student?: {
    school_id: string;
  };
  vendor?: {
    name: string;
    type: string;
  };
}

interface SchoolRecord {
  id: string;
  name: string;
}

export const generateConsumptionAnalysisReport = async (vendorId?: string): Promise<ConsumptionAnalysisItemData[]> => {
  try {
    // Se não for especificado um vendorId, verificamos se existe um relatório geral
    if (!vendorId) {
      const report = await fetchFinancialReport('consumption_analysis');
      
      if (report && report.data) {
        return report.data;
      }
    }
    
    let query = supabase
      .from('consumption_analysis')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('amount', { ascending: false })
      .limit(20);
      
    // Se tiver um vendorId, filtramos por ele
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    
    // Use returns<T>() to explicitly specify the return type
    const { data, error } = await query.returns<ConsumptionAnalysisRecord[]>();
    
    if (error) {
      console.error("Error fetching consumption analysis data:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      // Se não encontramos dados para o vendedor específico ou geral,
      // vamos gerar dados simulados a partir das transações
      return vendorId ? 
        await generateConsumptionDataFromTransactions(vendorId) :
        await generateConsumptionDataFromTransactions();
    }
    
    return data.map(item => ({
      schoolId: item.school_id,
      schoolName: item.school?.name || 'Escola não informada',
      productType: item.product_type,
      amount: item.amount,
      quantity: item.quantity,
      studentCount: item.student_count,
      averagePerStudent: item.average_per_student,
      vendorId: vendorId || '', // Use o vendorId fornecido ou vazio
      vendorName: vendorId ? 'Cantina específica' : 'Cantina sem nome'
    }));
    
  } catch (error) {
    console.error("Error in generateConsumptionAnalysisReport:", error);
    return [];
  }
};

// Função para gerar dados de consumo a partir das transações quando não temos relatórios prontos
const generateConsumptionDataFromTransactions = async (vendorId?: string): Promise<ConsumptionAnalysisItemData[]> => {
  try {
    let transactionQuery = supabase
      .from('transactions')
      .select(`
        *,
        student:student_id (school_id),
        vendor:vendor_id (name, type)
      `)
      .eq('type', 'purchase')
      .eq('status', 'completed');
    
    if (vendorId) {
      transactionQuery = transactionQuery.eq('vendor_id', vendorId);
    }
    
    // Use returns<T>() to explicitly specify the return type
    const { data: transactions, error } = await transactionQuery.returns<TransactionRecord[]>();
    
    if (error || !transactions || transactions.length === 0) {
      console.warn("No transactions found for consumption analysis");
      return [];
    }
    
    // Vamos agrupar as transações por escola e calcular os valores
    const schoolMap = new Map<string, {
      totalAmount: number;
      totalQuantity: number;
      schoolId: string;
      vendorId: string;
      vendorName: string;
    }>();
    
    for (const tx of transactions) {
      const schoolId = tx.student?.school_id;
      if (!schoolId) continue;
      
      if (!schoolMap.has(schoolId)) {
        schoolMap.set(schoolId, {
          totalAmount: 0,
          totalQuantity: 0,
          schoolId,
          vendorId: tx.vendor_id || '',
          vendorName: tx.vendor?.name || 'Cantina sem nome'
        });
      }
      
      const schoolData = schoolMap.get(schoolId)!;
      schoolData.totalAmount += Number(tx.amount);
      schoolData.totalQuantity += 1;
    }
    
    // Agora vamos buscar as informações das escolas e alunos
    const schoolIds = Array.from(schoolMap.keys());
    
    const { data: schools } = await supabase
      .from('schools')
      .select('id, name')
      .in('id', schoolIds)
      .returns<SchoolRecord[]>();
    
    const schoolNames = schools?.reduce((acc: Record<string, string>, school) => {
      acc[school.id] = school.name;
      return acc;
    }, {}) || {};
    
    // E contar os alunos por escola
    const studentCounts: Record<string, number> = {};
    
    for (const schoolId of schoolIds) {
      const { count } = await supabase
        .from('students')
        .select('id', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('active', true);
      
      studentCounts[schoolId] = count || 0;
    }
    
    // Agora formatamos o resultado para o formato esperado
    return Array.from(schoolMap.values()).map(data => {
      const studentCount = studentCounts[data.schoolId] || 1;
      
      return {
        schoolId: data.schoolId,
        schoolName: schoolNames[data.schoolId] || 'Escola não informada',
        productType: 'Diversos', // Agrupamos tudo como diversos neste caso
        amount: data.totalAmount,
        quantity: data.totalQuantity,
        studentCount,
        averagePerStudent: data.totalAmount / studentCount,
        vendorId: data.vendorId,
        vendorName: data.vendorName
      };
    });
    
  } catch (error) {
    console.error("Error generating consumption data from transactions:", error);
    return [];
  }
};

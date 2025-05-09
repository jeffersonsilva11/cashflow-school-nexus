
import { ConsumptionAnalysisItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";

// Simplifique as interfaces para evitar aninhamento e recursão
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
  // Sem campos aninhados
}

interface TransactionRecord {
  id: string;
  amount: number;
  vendor_id: string;
  student_id: string;
  status: string;
  type: string;
  created_at: string;
  // Sem campos aninhados
}

interface SchoolRecord {
  id: string;
  name: string;
}

interface VendorRecord {
  id: string;
  name: string;
  type: string;
}

interface StudentRecord {
  id: string;
  school_id: string;
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
    
    // Estratégia 1: Dividir em consultas separadas
    let consumptionData: ConsumptionAnalysisRecord[] = [];
    let schoolsData: Record<string, string> = {}; // Map de school_id -> name
    
    // Primeiro consulta: Buscar apenas os dados de consumo
    {
      let query = supabase
        .from('consumption_analysis')
        .select('*') // Sem junções aninhadas
        .order('amount', { ascending: false })
        .limit(20);
        
      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
      }
      
      const { data, error } = await query;
      
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
      
      consumptionData = data as ConsumptionAnalysisRecord[];
    }
    
    // Segunda consulta: Buscar as escolas relacionadas
    if (consumptionData.length > 0) {
      const schoolIds = consumptionData.map(item => item.school_id).filter(Boolean);
      
      if (schoolIds.length > 0) {
        const { data: schools } = await supabase
          .from('schools')
          .select('id, name')
          .in('id', schoolIds);
        
        if (schools) {
          schoolsData = schools.reduce((acc: Record<string, string>, school) => {
            acc[school.id] = school.name;
            return acc;
          }, {});
        }
      }
    }
    
    // Agora combinar os dados
    return consumptionData.map(item => ({
      schoolId: item.school_id,
      schoolName: schoolsData[item.school_id] || 'Escola não informada',
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
    // Estratégia: Realizar múltiplas consultas separadas em vez de junções complexas
    
    // 1. Primeiro, consultar as transações
    let transactionsRaw: TransactionRecord[] = [];
    
    {
      let query = supabase
        .from('transactions')
        .select('*') // Sem junções aninhadas
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
    
    // 2. Coletar IDs de estudantes e vendedores para consultas separadas
    const studentIds = Array.from(new Set(transactionsRaw.map(tx => tx.student_id).filter(Boolean)));
    const vendorIds = Array.from(new Set(transactionsRaw.map(tx => tx.vendor_id).filter(Boolean)));
    
    // 3. Buscar informações de estudantes relacionados
    const studentSchoolMap: Record<string, string> = {}; // student_id -> school_id
    
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
    
    // 4. Buscar informações de vendedores
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
    
    // 5. Agrupar transações por escola
    const schoolTransactionsMap: Record<string, {
      totalAmount: number;
      totalQuantity: number;
      schoolId: string;
      vendorId: string;
      vendorName: string;
    }> = {};
    
    for (const tx of transactionsRaw) {
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
    
    // 6. Buscar nomes das escolas
    const schoolIds = Object.keys(schoolTransactionsMap);
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
    
    // 7. Contar alunos por escola
    const studentCounts: Record<string, number> = {};
    
    for (const schoolId of schoolIds) {
      const { count } = await supabase
        .from('students')
        .select('id', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('active', true);
      
      studentCounts[schoolId] = count || 0;
    }
    
    // 8. Formatar o resultado final
    return Object.values(schoolTransactionsMap).map(data => {
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

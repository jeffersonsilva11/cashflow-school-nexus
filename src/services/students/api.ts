
import { supabase } from "@/integrations/supabase/client";

// Função para buscar relatórios de atividade dos estudantes
export const fetchStudentActivityReport = async () => {
  try {
    // Modificando para buscar da tabela financial_reports com o tipo específico
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', 'student_activity')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // Se encontrar um relatório, retorne os dados específicos dele
    if (data && data.length > 0 && data[0].data) {
      return data[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching student activity report:", error);
    return null;
  }
};

// Função para buscar relatórios demográficos dos estudantes
export const fetchStudentDemographicsReport = async () => {
  try {
    // Podemos obter dados demográficos diretamente da tabela de estudantes
    // Como não podemos usar .group('grade') diretamente, faremos uma busca simples
    // e processaremos os dados manualmente
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('grade');
    
    if (studentsError) throw studentsError;
    
    if (students && students.length > 0) {
      // Agrupando manualmente
      const gradeCount: Record<string, number> = {};
      students.forEach(student => {
        const grade = student.grade || 'Não especificado';
        gradeCount[grade] = (gradeCount[grade] || 0) + 1;
      });
      
      // Convertendo para o formato esperado
      const result = Object.entries(gradeCount).map(([grade, count]) => ({
        grade,
        count
      }));
      
      return result;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching student demographics report:", error);
    return null;
  }
};

// Função para buscar relatórios de retenção de estudantes
export const fetchStudentRetentionReport = async () => {
  try {
    // Modificando para buscar da tabela financial_reports com o tipo específico
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', 'student_retention')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // Se encontrar um relatório, retorne os dados específicos dele
    if (data && data.length > 0 && data[0].data) {
      return data[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching student retention report:", error);
    return null;
  }
};


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
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('grade, count(*)')
      .group('grade')
      .order('grade');
    
    if (studentsError) throw studentsError;
    
    if (students && students.length > 0) {
      return students;
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


import { supabase } from "@/integrations/supabase/client";

// Função para buscar relatórios de atividade dos estudantes
export const fetchStudentActivityReport = async () => {
  try {
    // Tentar buscar da tabela específica de relatórios de atividade de estudantes
    const { data: activityData, error: activityError } = await supabase
      .from('student_activity_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (activityError) {
      console.error("Error fetching from student_activity_reports:", activityError);
      
      // Fallback para buscar da tabela financial_reports com o tipo específico
      const { data: reportData, error: reportError } = await supabase
        .from('financial_reports')
        .select('*')
        .eq('report_type', 'student_activity')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (reportError) throw reportError;
      
      // Se encontrar um relatório, retorne os dados específicos dele
      if (reportData && reportData.length > 0 && reportData[0].data) {
        return reportData[0].data;
      }
      
      return null;
    }
    
    if (activityData && activityData.length > 0) {
      return activityData;
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
    // Tentar buscar da tabela específica de relatórios demográficos
    const { data: demographicsData, error: demographicsError } = await supabase
      .from('student_demographics_reports')
      .select('*')
      .order('grade');
    
    if (demographicsError) {
      console.error("Error fetching from student_demographics_reports:", demographicsError);
      
      // Se não conseguir da tabela específica, tenta obter dados demográficos diretamente da tabela de estudantes
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
        
        // Calculando total para percentuais
        const total = Object.values(gradeCount).reduce((sum, count) => sum + count, 0);
        
        // Convertendo para o formato esperado
        const result = Object.entries(gradeCount).map(([grade, count]) => ({
          grade,
          count,
          percentage: Math.round((count / total) * 100)
        }));
        
        return result;
      }
      
      return null;
    }
    
    if (demographicsData && demographicsData.length > 0) {
      return demographicsData;
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
    // Tentar buscar da tabela específica de retenção de estudantes
    const { data: retentionData, error: retentionError } = await supabase
      .from('student_retention_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (retentionError) {
      console.error("Error fetching from student_retention_reports:", retentionError);
      
      // Fallback para buscar da tabela financial_reports com o tipo específico
      const { data: reportData, error: reportError } = await supabase
        .from('financial_reports')
        .select('*')
        .eq('report_type', 'student_retention')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (reportError) throw reportError;
      
      // Se encontrar um relatório, retorne os dados específicos dele
      if (reportData && reportData.length > 0 && reportData[0].data) {
        return reportData[0].data;
      }
      
      return null;
    }
    
    if (retentionData && retentionData.length > 0) {
      return retentionData;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching student retention report:", error);
    return null;
  }
};

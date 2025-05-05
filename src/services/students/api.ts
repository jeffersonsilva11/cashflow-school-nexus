
import { supabase } from "@/integrations/supabase/client";

// Função para buscar relatórios de atividade dos estudantes
export const fetchStudentActivityReport = async () => {
  try {
    const { data, error } = await supabase
      .from('student_activity_reports')
      .select('*')
      .order('period', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching student activity report:", error);
    return null;
  }
};

// Função para buscar relatórios demográficos dos estudantes
export const fetchStudentDemographicsReport = async () => {
  try {
    const { data, error } = await supabase
      .from('student_demographics')
      .select('*')
      .order('grade', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching student demographics report:", error);
    return null;
  }
};

// Função para buscar relatórios de retenção de estudantes
export const fetchStudentRetentionReport = async () => {
  try {
    const { data, error } = await supabase
      .from('student_retention')
      .select('*')
      .order('period', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching student retention report:", error);
    return null;
  }
};

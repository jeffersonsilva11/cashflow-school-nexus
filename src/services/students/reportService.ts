
import { fetchStudentActivityReport, fetchStudentDemographicsReport, fetchStudentRetentionReport } from './api';
import { getMockStudentActivityData, getMockStudentDemographicsData, getMockStudentRetentionData } from './mock';

// Tipos de dados para os relatórios de estudantes
export type StudentActivityData = {
  period: string;
  count: number;
  activity_type?: string;
};

export type StudentDemographicsData = {
  grade: string;
  count: number;
  percentage?: number;
};

export type StudentRetentionData = {
  period: string;
  retention_rate: number;
  enrolled: number;
  left: number;
};

// Função para gerar relatório de atividade dos estudantes
export const generateStudentActivityReport = async (): Promise<StudentActivityData[]> => {
  try {
    const reportData = await fetchStudentActivityReport();
    
    if (reportData && Array.isArray(reportData)) {
      // Garantir que os dados correspondam ao tipo StudentActivityData
      return reportData.map((item: any) => ({
        period: item.period || '',
        count: item.count || 0,
        activity_type: item.activity_type || undefined
      })) as StudentActivityData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockStudentActivityData();
  } catch (error) {
    console.error("Error generating student activity report:", error);
    return getMockStudentActivityData();
  }
};

// Função para gerar relatório demográfico dos estudantes
export const generateStudentDemographicsReport = async (): Promise<StudentDemographicsData[]> => {
  try {
    const reportData = await fetchStudentDemographicsReport();
    
    if (reportData && reportData.length > 0) {
      // Calcular o total de estudantes para as porcentagens
      const total = reportData.reduce((sum, item) => sum + item.count, 0);
      
      // Garantir que os dados correspondam ao tipo StudentDemographicsData
      return reportData.map((item: any) => ({
        grade: item.grade || 'Não especificado',
        count: item.count || 0,
        percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
      })) as StudentDemographicsData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockStudentDemographicsData();
  } catch (error) {
    console.error("Error generating student demographics report:", error);
    return getMockStudentDemographicsData();
  }
};

// Função para gerar relatório de retenção dos estudantes
export const generateStudentRetentionReport = async (): Promise<StudentRetentionData[]> => {
  try {
    const reportData = await fetchStudentRetentionReport();
    
    if (reportData && Array.isArray(reportData)) {
      // Garantir que os dados correspondam ao tipo StudentRetentionData
      return reportData.map((item: any) => ({
        period: item.period || '',
        retention_rate: item.retention_rate || 0,
        enrolled: item.enrolled || 0,
        left: item.left || 0
      })) as StudentRetentionData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockStudentRetentionData();
  } catch (error) {
    console.error("Error generating student retention report:", error);
    return getMockStudentRetentionData();
  }
};


import { fetchStudentActivityReport, fetchStudentDemographicsReport, fetchStudentRetentionReport } from './api';
import { getMockStudentActivityData, getMockStudentDemographicsData, getMockStudentRetentionData } from './mock';

// Tipos de dados para os relatórios de estudantes
export type StudentActivityData = {
  period: string;
  count: number;
  activity_type?: string;
  // Campos adicionais para compatibilidade com os dados mockados
  month?: string;
  active?: number;
  inactive?: number;
  total?: number;
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
  // Campos adicionais para compatibilidade com os dados mockados
  newStudents?: number;
  transfers?: number;
  graduation?: number;
  retention?: number;
};

// Função para gerar relatório de atividade dos estudantes
export const generateStudentActivityReport = async (): Promise<StudentActivityData[]> => {
  try {
    const reportData = await fetchStudentActivityReport();
    
    if (reportData && Array.isArray(reportData)) {
      // Garantir que os dados correspondam ao tipo StudentActivityData
      return reportData.map((item: any) => ({
        period: item.period || item.month || '',
        count: item.count || item.active || 0,
        activity_type: item.activity_type || undefined,
        // Preservar campos originais dos dados mockados
        month: item.month,
        active: item.active,
        inactive: item.inactive,
        total: item.total
      })) as StudentActivityData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    const mockData = getMockStudentActivityData();
    return mockData.map(item => ({
      period: item.month,
      count: item.active,
      month: item.month,
      active: item.active,
      inactive: item.inactive,
      total: item.total
    }));
  } catch (error) {
    console.error("Error generating student activity report:", error);
    const mockData = getMockStudentActivityData();
    return mockData.map(item => ({
      period: item.month,
      count: item.active,
      month: item.month,
      active: item.active,
      inactive: item.inactive,
      total: item.total
    }));
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
        retention_rate: item.retention_rate || item.retention || 0,
        enrolled: item.enrolled || item.newStudents || 0,
        left: item.left || item.transfers || 0,
        // Preservar campos originais dos dados mockados
        newStudents: item.newStudents,
        transfers: item.transfers,
        graduation: item.graduation,
        retention: item.retention
      })) as StudentRetentionData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    const mockData = getMockStudentRetentionData();
    return mockData.map(item => ({
      period: item.period,
      retention_rate: item.retention,
      enrolled: item.newStudents,
      left: item.transfers,
      newStudents: item.newStudents,
      transfers: item.transfers,
      graduation: item.graduation,
      retention: item.retention
    }));
  } catch (error) {
    console.error("Error generating student retention report:", error);
    const mockData = getMockStudentRetentionData();
    return mockData.map(item => ({
      period: item.period,
      retention_rate: item.retention,
      enrolled: item.newStudents,
      left: item.transfers,
      newStudents: item.newStudents,
      transfers: item.transfers,
      graduation: item.graduation,
      retention: item.retention
    }));
  }
};


import { fetchStudentActivityReport, fetchStudentDemographicsReport, fetchStudentRetentionReport } from './api';
import { getMockStudentActivityData, getMockStudentDemographicsData, getMockStudentRetentionData } from './mock';

// Tipos de dados para os relatórios de estudantes
export type StudentActivityData = {
  month: string;
  active: number;
  inactive: number;
  total: number;
};

export type StudentDemographicsData = {
  grade: string;
  count: number;
  percentage: number;
};

export type StudentRetentionData = {
  period: string;
  newStudents: number;
  transfers: number;
  graduation: number;
  retention: number;
};

// Função para gerar relatório de atividade dos estudantes
export const generateStudentActivityReport = async (): Promise<StudentActivityData[]> => {
  try {
    const report = await fetchStudentActivityReport();
    
    if (report && report.length > 0) {
      return report as StudentActivityData[];
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
    const report = await fetchStudentDemographicsReport();
    
    if (report && report.length > 0) {
      return report as StudentDemographicsData[];
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
    const report = await fetchStudentRetentionReport();
    
    if (report && report.length > 0) {
      return report as StudentRetentionData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockStudentRetentionData();
  } catch (error) {
    console.error("Error generating student retention report:", error);
    return getMockStudentRetentionData();
  }
};

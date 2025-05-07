
import { StudentActivityData, StudentDemographicsData, StudentRetentionData } from './reportService';

export const getMockStudentActivityData = () => {
  return [
    { month: 'Jan', active: 145, inactive: 15, total: 160 },
    { month: 'Fev', active: 152, inactive: 12, total: 164 },
    { month: 'Mar', active: 159, inactive: 10, total: 169 },
    { month: 'Abr', active: 164, inactive: 8, total: 172 },
    { month: 'Mai', active: 170, inactive: 7, total: 177 },
    { month: 'Jun', active: 175, inactive: 5, total: 180 },
    { month: 'Jul', active: 181, inactive: 4, total: 185 },
    { month: 'Ago', active: 186, inactive: 3, total: 189 },
    { month: 'Set', active: 191, inactive: 2, total: 193 },
    { month: 'Out', active: 195, inactive: 4, total: 199 },
    { month: 'Nov', active: 200, inactive: 5, total: 205 },
    { month: 'Dez', active: 210, inactive: 3, total: 213 },
  ];
};

export const getMockStudentDemographicsData = (): StudentDemographicsData[] => {
  return [
    { grade: '1º ano', count: 25, percentage: 10 },
    { grade: '2º ano', count: 28, percentage: 11 },
    { grade: '3º ano', count: 22, percentage: 9 },
    { grade: '4º ano', count: 24, percentage: 10 },
    { grade: '5º ano', count: 26, percentage: 11 },
    { grade: '6º ano', count: 30, percentage: 12 },
    { grade: '7º ano', count: 27, percentage: 11 },
    { grade: '8º ano', count: 25, percentage: 10 },
    { grade: '9º ano', count: 20, percentage: 8 },
    { grade: '1º EM', count: 15, percentage: 6 },
    { grade: '2º EM', count: 18, percentage: 7 },
    { grade: '3º EM', count: 12, percentage: 5 },
  ];
};

export const getMockStudentRetentionData = (): StudentRetentionData[] => {
  return [
    { 
      period: 'Jan-Mar', 
      new_students: 15, 
      transfers: 3, 
      graduation: 0,
      enrolled: 150,
      students_left: 5, 
      retention_rate: 97
    },
    { 
      period: 'Abr-Jun', 
      new_students: 12, 
      transfers: 2, 
      graduation: 0,
      enrolled: 160,
      students_left: 4, 
      retention_rate: 98
    },
    { 
      period: 'Jul-Set', 
      new_students: 18, 
      transfers: 5, 
      graduation: 0,
      enrolled: 173,
      students_left: 7, 
      retention_rate: 96
    },
    { 
      period: 'Out-Dez', 
      new_students: 10, 
      transfers: 3, 
      graduation: 12,
      enrolled: 168,
      students_left: 15, 
      retention_rate: 91
    },
  ];
};

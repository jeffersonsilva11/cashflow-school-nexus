
import { useQuery } from '@tanstack/react-query';
import { getMockStudentActivityData, getMockStudentDemographicsData, getMockStudentRetentionData } from './students/mock';
import { fetchStudentActivityReport, fetchStudentDemographicsReport, fetchStudentRetentionReport } from './students/api';

export const useStudentActivityReport = () => {
  return useQuery({
    queryKey: ['student-activity-report'],
    queryFn: async () => {
      try {
        const reportData = await fetchStudentActivityReport();
        
        if (reportData) {
          return reportData;
        }
        
        // Se não encontrar dados no banco, usar dados mockados
        return getMockStudentActivityData();
      } catch (error) {
        console.error("Error in useStudentActivityReport:", error);
        return getMockStudentActivityData();
      }
    },
    refetchOnWindowFocus: false
  });
};

export const useStudentDemographicsReport = () => {
  return useQuery({
    queryKey: ['student-demographics-report'],
    queryFn: async () => {
      try {
        const reportData = await fetchStudentDemographicsReport();
        
        if (reportData) {
          return reportData;
        }
        
        // Se não encontrar dados no banco, usar dados mockados
        return getMockStudentDemographicsData();
      } catch (error) {
        console.error("Error in useStudentDemographicsReport:", error);
        return getMockStudentDemographicsData();
      }
    },
    refetchOnWindowFocus: false
  });
};

export const useStudentRetentionReport = () => {
  return useQuery({
    queryKey: ['student-retention-report'],
    queryFn: async () => {
      try {
        const reportData = await fetchStudentRetentionReport();
        
        if (reportData) {
          return reportData;
        }
        
        // Se não encontrar dados no banco, usar dados mockados
        return getMockStudentRetentionData();
      } catch (error) {
        console.error("Error in useStudentRetentionReport:", error);
        return getMockStudentRetentionData();
      }
    },
    refetchOnWindowFocus: false
  });
};


import { useQuery } from "@tanstack/react-query";
import {
  generateStudentActivityReport,
  generateStudentDemographicsReport,
  generateStudentRetentionReport,
  StudentActivityData,
  StudentDemographicsData,
  StudentRetentionData
} from './students/reportService';

// React Query hooks for student report generation
export function useStudentActivityReport() {
  return useQuery<StudentActivityData[], Error>({
    queryKey: ['student-activity'],
    queryFn: generateStudentActivityReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStudentDemographicsReport() {
  return useQuery<StudentDemographicsData[], Error>({
    queryKey: ['student-demographics'],
    queryFn: generateStudentDemographicsReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStudentRetentionReport() {
  return useQuery<StudentRetentionData[], Error>({
    queryKey: ['student-retention'],
    queryFn: generateStudentRetentionReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

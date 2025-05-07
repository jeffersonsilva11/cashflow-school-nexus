
import { supabase } from "@/integrations/supabase/client";

export type StudentActivity = {
  id: string;
  period: string;
  month: string;
  active: number;
  inactive: number;
  total: number;
  created_at?: string;
  updated_at?: string;
};

export type StudentDemographics = {
  id: string;
  grade: string;
  count: number;
  percentage: number;
  created_at?: string;
  updated_at?: string;
};

export type StudentRetention = {
  id: string;
  period: string;
  new_students: number;
  transfers: number;
  graduation: number;
  enrolled: number;
  students_left: number;
  retention_rate: number;
  created_at?: string;
  updated_at?: string;
};

export const fetchStudentActivityReport = async (): Promise<StudentActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('student_activity_reports')
      .select('*')
      .order('month');
    
    if (error) {
      console.error("Error fetching student activity report:", error);
      throw error;
    }
    
    return data as StudentActivity[];
  } catch (error) {
    console.error("Error in fetchStudentActivityReport:", error);
    throw error;
  }
};

export const fetchStudentDemographicsReport = async (): Promise<StudentDemographics[]> => {
  try {
    const { data, error } = await supabase
      .from('student_demographics_reports')
      .select('*');
    
    if (error) {
      console.error("Error fetching student demographics report:", error);
      throw error;
    }
    
    return data as StudentDemographics[];
  } catch (error) {
    console.error("Error in fetchStudentDemographicsReport:", error);
    throw error;
  }
};

export const fetchStudentRetentionReport = async (): Promise<StudentRetention[]> => {
  try {
    const { data, error } = await supabase
      .from('student_retention_reports')
      .select('*')
      .order('period');
    
    if (error) {
      console.error("Error fetching student retention report:", error);
      throw error;
    }
    
    return data as StudentRetention[];
  } catch (error) {
    console.error("Error in fetchStudentRetentionReport:", error);
    throw error;
  }
};

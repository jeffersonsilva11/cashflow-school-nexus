
import { supabase } from "@/integrations/supabase/client";

export interface Student {
  id: string;
  name: string;
  grade?: string;
  school_id?: string;
  document_id?: string;
  date_of_birth?: string;
  active?: boolean;
  photo_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  school?: { name: string } | null;
}

// Fetch all students
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('name');
    
    if (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
    
    return data as Student[];
  } catch (error) {
    console.error("Error in fetchStudents:", error);
    throw error;
  }
};

// Fetch a single student by ID
export const fetchStudentById = async (id: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching student with ID ${id}:`, error);
      throw error;
    }
    
    return data as Student;
  } catch (error) {
    console.error(`Error in fetchStudentById for ${id}:`, error);
    throw error;
  }
};

// Create a new student
export const createStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating student:", error);
      throw error;
    }
    
    return data as Student;
  } catch (error) {
    console.error("Error in createStudent:", error);
    throw error;
  }
};

// Update an existing student
export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating student with ID ${id}:`, error);
      throw error;
    }
    
    return data as Student;
  } catch (error) {
    console.error(`Error in updateStudent for ${id}:`, error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting student with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteStudent for ${id}:`, error);
    throw error;
  }
};

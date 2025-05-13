
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

// Fetch students by school ID
export const fetchStudentsBySchool = async (schoolId: string): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('school_id', schoolId)
      .order('name');
    
    if (error) {
      console.error(`Error fetching students for school ${schoolId}:`, error);
      throw error;
    }
    
    return data as Student[];
  } catch (error) {
    console.error(`Error in fetchStudentsBySchool for ${schoolId}:`, error);
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

// Link student to parent/guardian
export const linkStudentToParent = async (studentId: string, parentId: string, relationship?: string, isPrimary: boolean = false): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('parent_student')
      .insert({
        student_id: studentId,
        parent_id: parentId,
        relationship,
        is_primary: isPrimary
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error linking student ${studentId} to parent ${parentId}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in linkStudentToParent:`, error);
    throw error;
  }
};

// Unlink student from parent/guardian
export const unlinkStudentFromParent = async (studentId: string, parentId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('parent_student')
      .delete()
      .match({
        student_id: studentId,
        parent_id: parentId
      });
    
    if (error) {
      console.error(`Error unlinking student ${studentId} from parent ${parentId}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in unlinkStudentFromParent:`, error);
    throw error;
  }
};

// Fetch parents linked to a student
export const fetchParentsByStudent = async (studentId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('parent_student')
      .select(`
        parent:parent_id (*),
        relationship,
        is_primary
      `)
      .eq('student_id', studentId);
    
    if (error) {
      console.error(`Error fetching parents for student ${studentId}:`, error);
      throw error;
    }
    
    return data.map(item => ({
      ...item.parent,
      relationship: item.relationship,
      is_primary: item.is_primary
    }));
  } catch (error) {
    console.error(`Error in fetchParentsByStudent:`, error);
    throw error;
  }
};

// Report-related API functions
export const fetchStudentActivityReport = async () => {
  try {
    const { data, error } = await supabase
      .from('student_activity_reports')
      .select('*')
      .order('month');
    
    if (error) {
      console.error("Error fetching student activity report:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchStudentActivityReport:", error);
    return null;
  }
};

export const fetchStudentDemographicsReport = async () => {
  try {
    const { data, error } = await supabase
      .from('student_demographics_reports')
      .select('*')
      .order('grade');
    
    if (error) {
      console.error("Error fetching student demographics report:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchStudentDemographicsReport:", error);
    return null;
  }
};

export const fetchStudentRetentionReport = async () => {
  try {
    const { data, error } = await supabase
      .from('student_retention_reports')
      .select('*')
      .order('period');
    
    if (error) {
      console.error("Error fetching student retention report:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchStudentRetentionReport:", error);
    return null;
  }
};

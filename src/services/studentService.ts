
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define student type
export type Student = {
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
};

// Fetch all students
export async function fetchStudents() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('name');
    
    if (error) throw error;
    return data as (Student & { school: { name: string } })[];
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

// Fetch a single student by ID
export async function fetchStudentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Student & { school: { name: string } };
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    throw error;
  }
}

// Create a new student
export async function createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    
    if (error) throw error;
    return data as Student;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

// Update a student
export async function updateStudent(id: string, updates: Partial<Student>) {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Student;
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    throw error;
  }
}

// Delete a student
export async function deleteStudent(id: string) {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    throw error;
  }
}

// React Query Hooks
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });
}

export function useStudent(id: string | undefined) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => fetchStudentById(id as string),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Aluno criado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar aluno", 
        description: error.message || "Ocorreu um erro ao criar o aluno",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Student> }) => 
      updateStudent(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', data.id] });
      toast({ title: "Aluno atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar aluno", 
        description: error.message || "Ocorreu um erro ao atualizar o aluno",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Aluno removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover aluno", 
        description: error.message || "Ocorreu um erro ao remover o aluno",
        variant: "destructive" 
      });
    }
  });
}


import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface Parent {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  document_id?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface ParentStudent {
  id: string;
  parent_id: string;
  student_id: string;
  relationship?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchParents() {
  try {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Parent[];
  } catch (error) {
    console.error("Error fetching parents:", error);
    throw error;
  }
}

export async function fetchParentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Parent;
  } catch (error) {
    console.error(`Error fetching parent ${id}:`, error);
    throw error;
  }
}

export async function fetchParentsByStudentId(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('parent_student')
      .select(`
        parent_id,
        relationship,
        is_primary,
        parent:parent_id (*)
      `)
      .eq('student_id', studentId);
    
    if (error) throw error;
    return data.map(item => ({
      ...item.parent,
      relationship: item.relationship,
      is_primary: item.is_primary
    }));
  } catch (error) {
    console.error(`Error fetching parents for student ${studentId}:`, error);
    throw error;
  }
}

export async function fetchStudentsByParentId(parentId: string) {
  try {
    const { data, error } = await supabase
      .from('parent_student')
      .select(`
        student_id,
        relationship,
        is_primary,
        student:student_id (*)
      `)
      .eq('parent_id', parentId);
    
    if (error) throw error;
    return data.map(item => ({
      ...item.student,
      relationship: item.relationship,
      is_primary: item.is_primary
    }));
  } catch (error) {
    console.error(`Error fetching students for parent ${parentId}:`, error);
    throw error;
  }
}

export async function createParent(parent: Omit<Parent, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('parents')
      .insert(parent)
      .select()
      .single();
    
    if (error) throw error;
    return data as Parent;
  } catch (error) {
    console.error("Error creating parent:", error);
    throw error;
  }
}

export async function updateParent(id: string, updates: Partial<Parent>) {
  try {
    const { data, error } = await supabase
      .from('parents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Parent;
  } catch (error) {
    console.error(`Error updating parent ${id}:`, error);
    throw error;
  }
}

export async function deleteParent(id: string) {
  try {
    const { error } = await supabase
      .from('parents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting parent ${id}:`, error);
    throw error;
  }
}

export async function linkParentToStudent(parentId: string, studentId: string, relationship?: string, isPrimary: boolean = false) {
  try {
    const { data, error } = await supabase
      .from('parent_student')
      .insert({
        parent_id: parentId,
        student_id: studentId,
        relationship,
        is_primary: isPrimary
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as ParentStudent;
  } catch (error) {
    console.error(`Error linking parent ${parentId} to student ${studentId}:`, error);
    throw error;
  }
}

export async function unlinkParentFromStudent(parentId: string, studentId: string) {
  try {
    const { error } = await supabase
      .from('parent_student')
      .delete()
      .match({
        parent_id: parentId,
        student_id: studentId
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error unlinking parent ${parentId} from student ${studentId}:`, error);
    throw error;
  }
}

export async function updateParentStudentRelationship(parentId: string, studentId: string, updates: { relationship?: string, is_primary?: boolean }) {
  try {
    const { data, error } = await supabase
      .from('parent_student')
      .update(updates)
      .match({
        parent_id: parentId,
        student_id: studentId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as ParentStudent;
  } catch (error) {
    console.error(`Error updating relationship between parent ${parentId} and student ${studentId}:`, error);
    throw error;
  }
}

// React Query hooks
export function useParents() {
  return useQuery({
    queryKey: ['parents'],
    queryFn: fetchParents,
  });
}

export function useParent(id: string | undefined) {
  return useQuery({
    queryKey: ['parent', id],
    queryFn: () => fetchParentById(id as string),
    enabled: !!id,
  });
}

export function useParentsByStudent(studentId: string | undefined) {
  return useQuery({
    queryKey: ['parents', 'student', studentId],
    queryFn: () => fetchParentsByStudentId(studentId as string),
    enabled: !!studentId,
  });
}

export function useStudentsByParent(parentId: string | undefined) {
  return useQuery({
    queryKey: ['students', 'parent', parentId],
    queryFn: () => fetchStudentsByParentId(parentId as string),
    enabled: !!parentId,
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createParent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast({ title: "Responsável criado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar responsável", 
        description: error.message || "Ocorreu um erro ao criar o responsável",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateParent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Parent> }) => 
      updateParent(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      queryClient.invalidateQueries({ queryKey: ['parent', data.id] });
      toast({ title: "Responsável atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar responsável", 
        description: error.message || "Ocorreu um erro ao atualizar o responsável",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteParent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteParent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast({ title: "Responsável removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover responsável", 
        description: error.message || "Ocorreu um erro ao remover o responsável",
        variant: "destructive" 
      });
    }
  });
}

export function useLinkParentToStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      parentId, 
      studentId, 
      relationship, 
      isPrimary 
    }: { 
      parentId: string, 
      studentId: string, 
      relationship?: string, 
      isPrimary?: boolean 
    }) => linkParentToStudent(parentId, studentId, relationship, isPrimary),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['parents', 'student', data.student_id] });
      queryClient.invalidateQueries({ queryKey: ['students', 'parent', data.parent_id] });
      toast({ title: "Relação entre responsável e estudante estabelecida com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao vincular responsável e estudante", 
        description: error.message || "Ocorreu um erro ao estabelecer a relação",
        variant: "destructive" 
      });
    }
  });
}

export function useUnlinkParentFromStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ parentId, studentId }: { parentId: string, studentId: string }) => 
      unlinkParentFromStudent(parentId, studentId),
    onSuccess: (_, { parentId, studentId }) => {
      queryClient.invalidateQueries({ queryKey: ['parents', 'student', studentId] });
      queryClient.invalidateQueries({ queryKey: ['students', 'parent', parentId] });
      toast({ title: "Vínculo entre responsável e estudante removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao desvincular responsável e estudante", 
        description: error.message || "Ocorreu um erro ao remover a relação",
        variant: "destructive" 
      });
    }
  });
}

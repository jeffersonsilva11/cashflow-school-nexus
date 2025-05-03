
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define types
export type School = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  subscription_status?: string;
  subscription_plan?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Fetch all schools
export async function fetchSchools() {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as School[];
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error;
  }
}

// Fetch a single school by ID
export async function fetchSchoolById(id: string) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as School;
  } catch (error) {
    console.error(`Error fetching school ${id}:`, error);
    throw error;
  }
}

// Create a new school
export async function createSchool(school: Omit<School, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert(school)
      .select()
      .single();
    
    if (error) throw error;
    return data as School;
  } catch (error) {
    console.error("Error creating school:", error);
    throw error;
  }
}

// Update a school
export async function updateSchool(id: string, updates: Partial<School>) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as School;
  } catch (error) {
    console.error(`Error updating school ${id}:`, error);
    throw error;
  }
}

// Delete a school
export async function deleteSchool(id: string) {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting school ${id}:`, error);
    throw error;
  }
}

// React Query Hooks
export function useSchools() {
  return useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools,
  });
}

export function useSchool(id: string | undefined) {
  return useQuery({
    queryKey: ['school', id],
    queryFn: () => fetchSchoolById(id as string),
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({ title: "Escola criada com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar escola", 
        description: error.message || "Ocorreu um erro ao criar a escola",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<School> }) => 
      updateSchool(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['school', data.id] });
      toast({ title: "Escola atualizada com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar escola", 
        description: error.message || "Ocorreu um erro ao atualizar a escola",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({ title: "Escola removida com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover escola", 
        description: error.message || "Ocorreu um erro ao remover a escola",
        variant: "destructive" 
      });
    }
  });
}

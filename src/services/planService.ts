
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define types
export type Plan = {
  id: string;
  name: string;
  price_per_student: number;
  student_range?: string;
  device_limit?: number;
  min_students?: number;
  max_students?: number;
  description?: string;
  features?: any;
  created_at?: string;
  updated_at?: string;
};

// Fetch all plans
export async function fetchPlans() {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price_per_student');
    
    if (error) throw error;
    return data as Plan[];
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
}

// Fetch a single plan by ID
export async function fetchPlanById(id: string) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Plan;
  } catch (error) {
    console.error(`Error fetching plan ${id}:`, error);
    throw error;
  }
}

// Create a new plan
export async function createPlan(plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .insert(plan)
      .select()
      .single();
    
    if (error) throw error;
    return data as Plan;
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
}

// Update a plan
export async function updatePlan(id: string, updates: Partial<Plan>) {
  try {
    const { data, error } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Plan;
  } catch (error) {
    console.error(`Error updating plan ${id}:`, error);
    throw error;
  }
}

// Delete a plan
export async function deletePlan(id: string) {
  try {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting plan ${id}:`, error);
    throw error;
  }
}

// React Query Hooks
export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  });
}

export function usePlan(id: string | undefined) {
  return useQuery({
    queryKey: ['plan', id],
    queryFn: () => fetchPlanById(id as string),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({ title: "Plano criado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar plano", 
        description: error.message || "Ocorreu um erro ao criar o plano",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Plan> }) => 
      updatePlan(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plan', data.id] });
      toast({ title: "Plano atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar plano", 
        description: error.message || "Ocorreu um erro ao atualizar o plano",
        variant: "destructive" 
      });
    }
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast({ title: "Plano removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover plano", 
        description: error.message || "Ocorreu um erro ao remover o plano",
        variant: "destructive" 
      });
    }
  });
}

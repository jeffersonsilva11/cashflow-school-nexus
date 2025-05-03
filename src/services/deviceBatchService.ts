
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface DeviceBatch {
  id: string;
  name: string;
  batch_id: string;
  device_type: string;
  quantity: number;
  available: number;
  allocated: number;
  supplier?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function fetchDeviceBatches() {
  try {
    const { data, error } = await supabase
      .from('device_batches')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as DeviceBatch[];
  } catch (error) {
    console.error("Error fetching device batches:", error);
    throw error;
  }
}

export async function fetchDeviceBatchById(id: string) {
  try {
    const { data, error } = await supabase
      .from('device_batches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as DeviceBatch;
  } catch (error) {
    console.error(`Error fetching device batch ${id}:`, error);
    throw error;
  }
}

export async function createDeviceBatch(batch: Omit<DeviceBatch, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('device_batches')
      .insert(batch)
      .select()
      .single();
    
    if (error) throw error;
    return data as DeviceBatch;
  } catch (error) {
    console.error("Error creating device batch:", error);
    throw error;
  }
}

export async function updateDeviceBatch(id: string, updates: Partial<DeviceBatch>) {
  try {
    const { data, error } = await supabase
      .from('device_batches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as DeviceBatch;
  } catch (error) {
    console.error(`Error updating device batch ${id}:`, error);
    throw error;
  }
}

export async function deleteDeviceBatch(id: string) {
  try {
    const { error } = await supabase
      .from('device_batches')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting device batch ${id}:`, error);
    throw error;
  }
}

// React Query hooks
export function useDeviceBatches() {
  return useQuery({
    queryKey: ['device-batches'],
    queryFn: fetchDeviceBatches,
  });
}

export function useDeviceBatch(id: string | undefined) {
  return useQuery({
    queryKey: ['device-batch', id],
    queryFn: () => fetchDeviceBatchById(id as string),
    enabled: !!id,
  });
}

export function useCreateDeviceBatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDeviceBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-batches'] });
      toast({ title: "Lote criado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar lote", 
        description: error.message || "Ocorreu um erro ao criar o lote",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateDeviceBatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<DeviceBatch> }) => 
      updateDeviceBatch(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['device-batches'] });
      queryClient.invalidateQueries({ queryKey: ['device-batch', data.id] });
      toast({ title: "Lote atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar lote", 
        description: error.message || "Ocorreu um erro ao atualizar o lote",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteDeviceBatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteDeviceBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-batches'] });
      toast({ title: "Lote removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover lote", 
        description: error.message || "Ocorreu um erro ao remover o lote",
        variant: "destructive" 
      });
    }
  });
}

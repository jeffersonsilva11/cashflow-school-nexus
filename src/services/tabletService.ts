
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface Tablet {
  id: string;
  serial_number: string;
  school_id?: string;
  status: string;
  model?: string;
  os_version?: string;
  app_version?: string;
  battery_level?: number;
  last_sync_at?: string;
  connection_status: string;
  assigned_at?: string;
  created_at: string;
  updated_at: string;
  school?: { name: string } | null;
}

export async function fetchTablets() {
  try {
    const { data, error } = await supabase
      .from('tablets')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tablet[];
  } catch (error) {
    console.error("Error fetching tablets:", error);
    throw error;
  }
}

export async function fetchTabletById(id: string) {
  try {
    const { data, error } = await supabase
      .from('tablets')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Tablet;
  } catch (error) {
    console.error(`Error fetching tablet ${id}:`, error);
    throw error;
  }
}

export async function createTablet(tablet: Omit<Tablet, 'id' | 'created_at' | 'updated_at' | 'school'>) {
  try {
    const { data, error } = await supabase
      .from('tablets')
      .insert(tablet)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tablet;
  } catch (error) {
    console.error("Error creating tablet:", error);
    throw error;
  }
}

export async function updateTablet(id: string, updates: Partial<Omit<Tablet, 'school'>>) {
  try {
    const { data, error } = await supabase
      .from('tablets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tablet;
  } catch (error) {
    console.error(`Error updating tablet ${id}:`, error);
    throw error;
  }
}

export async function deleteTablet(id: string) {
  try {
    const { error } = await supabase
      .from('tablets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting tablet ${id}:`, error);
    throw error;
  }
}

// Fetch tablet statistics
export async function fetchTabletStatistics() {
  try {
    // Total tablets
    const { count: totalTablets } = await supabase
      .from('tablets')
      .select('*', { count: 'exact', head: true });
    
    // Online tablets
    const { count: onlineTablets } = await supabase
      .from('tablets')
      .select('*', { count: 'exact', head: true })
      .eq('connection_status', 'online');
    
    // Offline tablets
    const { count: offlineTablets } = await supabase
      .from('tablets')
      .select('*', { count: 'exact', head: true })
      .eq('connection_status', 'offline');
    
    // Low battery tablets (below 20%)
    const { count: lowBatteryTablets } = await supabase
      .from('tablets')
      .select('*', { count: 'exact', head: true })
      .lt('battery_level', 20)
      .gt('battery_level', 0); // Ensure battery isn't 0 (which might mean it's just offline)
    
    // Get pending activation tablets
    const { count: pendingActivationTablets } = await supabase
      .from('tablets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get tablets with active alerts
    const { count: tabletsWithAlerts } = await supabase
      .from('device_alerts')
      .select('device_id', { count: 'exact', head: true })
      .eq('status', 'active');
    
    return {
      total: totalTablets || 0,
      online: onlineTablets || 0,
      offline: offlineTablets || 0,
      batteryLow: lowBatteryTablets || 0,
      pendingActivation: pendingActivationTablets || 0,
      alerts: tabletsWithAlerts || 0
    };
  } catch (error) {
    console.error("Error fetching tablet statistics:", error);
    throw error;
  }
}

// React Query hooks
export function useTablets() {
  return useQuery({
    queryKey: ['tablets'],
    queryFn: fetchTablets,
  });
}

export function useTablet(id: string | undefined) {
  return useQuery({
    queryKey: ['tablet', id],
    queryFn: () => fetchTabletById(id as string),
    enabled: !!id,
  });
}

export function useTabletStatistics() {
  return useQuery({
    queryKey: ['tablets', 'statistics'],
    queryFn: fetchTabletStatistics,
  });
}

export function useCreateTablet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTablet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablets'] });
      queryClient.invalidateQueries({ queryKey: ['tablets', 'statistics'] });
      toast({ title: "Tablet criado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar tablet", 
        description: error.message || "Ocorreu um erro ao criar o tablet",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateTablet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<Tablet, 'school'>> }) => 
      updateTablet(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tablets'] });
      queryClient.invalidateQueries({ queryKey: ['tablet', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tablets', 'statistics'] });
      toast({ title: "Tablet atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar tablet", 
        description: error.message || "Ocorreu um erro ao atualizar o tablet",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteTablet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTablet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablets'] });
      queryClient.invalidateQueries({ queryKey: ['tablets', 'statistics'] });
      toast({ title: "Tablet removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover tablet", 
        description: error.message || "Ocorreu um erro ao remover o tablet",
        variant: "destructive" 
      });
    }
  });
}

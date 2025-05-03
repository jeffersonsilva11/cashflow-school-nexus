
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define device type
export type Device = {
  id: string;
  serial_number: string;
  device_type: string;
  status: string;
  student_id?: string;
  school_id?: string;
  firmware_version?: string;
  device_model?: string;
  batch_id?: string;
  assigned_at?: string;
  last_used_at?: string;
  created_at?: string;
  updated_at?: string;
};

// Fetch all devices
export async function fetchDevices() {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        student:student_id (name),
        school:school_id (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Device & { 
      student: { name: string } | null,
      school: { name: string } | null
    })[];
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
}

// Fetch a single device by ID
export async function fetchDeviceById(id: string) {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        student:student_id (name),
        school:school_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Device & { 
      student: { name: string } | null,
      school: { name: string } | null
    };
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    throw error;
  }
}

// Create a new device
export async function createDevice(device: Omit<Device, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('devices')
      .insert(device)
      .select()
      .single();
    
    if (error) throw error;
    return data as Device;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
}

// Update a device
export async function updateDevice(id: string, updates: Partial<Device>) {
  try {
    const { data, error } = await supabase
      .from('devices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Device;
  } catch (error) {
    console.error(`Error updating device ${id}:`, error);
    throw error;
  }
}

// Delete a device
export async function deleteDevice(id: string) {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting device ${id}:`, error);
    throw error;
  }
}

// Get device statistics
export async function fetchDeviceStatistics() {
  try {
    // Total devices
    const { count: totalDevices, error: totalError } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) throw totalError;
    
    // Active devices
    const { count: activeDevices, error: activeError } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (activeError) throw activeError;
    
    // Assigned devices
    const { count: assignedDevices, error: assignedError } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .not('student_id', 'is', null);
    
    if (assignedError) throw assignedError;
    
    return {
      total: totalDevices || 0,
      active: activeDevices || 0,
      assigned: assignedDevices || 0,
      unassigned: (totalDevices || 0) - (assignedDevices || 0),
      inactive: (totalDevices || 0) - (activeDevices || 0)
    };
  } catch (error) {
    console.error("Error fetching device statistics:", error);
    throw error;
  }
}

// React Query hooks
export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  });
}

export function useDevice(id: string | undefined) {
  return useQuery({
    queryKey: ['device', id],
    queryFn: () => fetchDeviceById(id as string),
    enabled: !!id,
  });
}

export function useDeviceStatistics() {
  return useQuery({
    queryKey: ['devices', 'statistics'],
    queryFn: fetchDeviceStatistics,
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['devices', 'statistics'] });
      toast({ title: "Dispositivo criado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar dispositivo", 
        description: error.message || "Ocorreu um erro ao criar o dispositivo",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Device> }) => 
      updateDevice(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', data.id] });
      queryClient.invalidateQueries({ queryKey: ['devices', 'statistics'] });
      toast({ title: "Dispositivo atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar dispositivo", 
        description: error.message || "Ocorreu um erro ao atualizar o dispositivo",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['devices', 'statistics'] });
      toast({ title: "Dispositivo removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover dispositivo", 
        description: error.message || "Ocorreu um erro ao remover o dispositivo",
        variant: "destructive" 
      });
    }
  });
}

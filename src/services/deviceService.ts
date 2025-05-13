
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

// Fetch devices by batch ID
export async function fetchDevicesByBatch(batchId: string) {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        student:student_id (name),
        school:school_id (name)
      `)
      .eq('batch_id', batchId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Device & { 
      student: { name: string } | null,
      school: { name: string } | null
    })[];
  } catch (error) {
    console.error(`Error fetching devices for batch ${batchId}:`, error);
    throw error;
  }
}

// Fetch devices by school ID
export async function fetchDevicesBySchool(schoolId: string) {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        student:student_id (name)
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Device & { 
      student: { name: string } | null
    })[];
  } catch (error) {
    console.error(`Error fetching devices for school ${schoolId}:`, error);
    throw error;
  }
}

// Fetch devices by student ID
export async function fetchDevicesByStudent(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Device[];
  } catch (error) {
    console.error(`Error fetching devices for student ${studentId}:`, error);
    throw error;
  }
}

// Assign device to student
export async function assignDeviceToStudent(deviceId: string, studentId: string) {
  try {
    const { data, error } = await supabase
      .from('devices')
      .update({
        student_id: studentId,
        assigned_at: new Date().toISOString(),
        status: 'assigned'
      })
      .eq('id', deviceId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Device;
  } catch (error) {
    console.error(`Error assigning device ${deviceId} to student ${studentId}:`, error);
    throw error;
  }
}

// Unassign device from student
export async function unassignDevice(deviceId: string) {
  try {
    const { data, error } = await supabase
      .from('devices')
      .update({
        student_id: null,
        status: 'unassigned'
      })
      .eq('id', deviceId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Device;
  } catch (error) {
    console.error(`Error unassigning device ${deviceId}:`, error);
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

// React Query hooks for devices
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

export function useDevicesByBatch(batchId: string | undefined) {
  return useQuery({
    queryKey: ['devices', 'batch', batchId],
    queryFn: () => fetchDevicesByBatch(batchId as string),
    enabled: !!batchId,
  });
}

export function useDevicesBySchool(schoolId: string | undefined) {
  return useQuery({
    queryKey: ['devices', 'school', schoolId],
    queryFn: () => fetchDevicesBySchool(schoolId as string),
    enabled: !!schoolId,
  });
}

export function useDevicesByStudent(studentId: string | undefined) {
  return useQuery({
    queryKey: ['devices', 'student', studentId],
    queryFn: () => fetchDevicesByStudent(studentId as string),
    enabled: !!studentId,
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

export function useAssignDeviceToStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ deviceId, studentId }: { deviceId: string, studentId: string }) => 
      assignDeviceToStudent(deviceId, studentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', data.id] });
      queryClient.invalidateQueries({ queryKey: ['devices', 'student', data.student_id] });
      toast({ title: "Dispositivo vinculado ao estudante com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao vincular dispositivo ao estudante", 
        description: error.message || "Ocorreu um erro ao vincular o dispositivo",
        variant: "destructive" 
      });
    }
  });
}

export function useUnassignDevice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: unassignDevice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', data.id] });
      toast({ title: "Dispositivo desvinculado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao desvincular dispositivo", 
        description: error.message || "Ocorreu um erro ao desvincular o dispositivo",
        variant: "destructive" 
      });
    }
  });
}

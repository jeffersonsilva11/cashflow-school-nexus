import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Define types
export interface DeviceStatistics {
  active: number;
  inactive: number;
  pending: number;
  transit: number;
  total: number;
}

export interface DeviceBatchData {
  id: string;
  name: string;
  batch_id: string;
  type: 'card' | 'wristband';
  quantity: number;
  available: number;
  allocated: number;
  date: string;
}

export interface UnallocatedDevice {
  id: string;
  serial_number: string;
  device_type: string;
  status: string;
  batch_id: string;
  created_at: string;
  school: { name: string } | null;
  student: { name: string } | null;
}

// Get device statistics 
export async function fetchDeviceStatistics(): Promise<DeviceStatistics> {
  try {
    // Count devices by status
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('status');
    
    if (devicesError) throw devicesError;
    
    // Count devices by status
    const active = devices.filter(d => d.status === 'active').length;
    const inactive = devices.filter(d => d.status === 'inactive').length;
    const pending = devices.filter(d => d.status === 'pending').length;
    const transit = devices.filter(d => d.status === 'in_transit').length;
    
    return {
      active,
      inactive,
      pending,
      transit,
      total: devices.length
    };
  } catch (error) {
    console.error("Error fetching device statistics:", error);
    return { active: 0, inactive: 0, pending: 0, transit: 0, total: 0 };
  }
}

// Get allocation of devices by school (top schools)
export async function fetchDeviceAllocationBySchool() {
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name');
      
    if (schoolsError) throw schoolsError;
    
    const schoolsWithDevices = await Promise.all(
      schools.map(async (school) => {
        const { count, error: countError } = await supabase
          .from('devices')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', school.id);
          
        if (countError) throw countError;
        
        return {
          name: school.name,
          value: count || 0  // Changed from 'devices' to 'value' to match component expectations
        };
      })
    );
    
    // Sort schools by number of devices in descending order
    return schoolsWithDevices.sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error("Error fetching device allocation by school:", error);
    return [];
  }
}

// Fetch recent device batches
export async function fetchRecentBatches(): Promise<DeviceBatchData[]> {
  try {
    const { data, error } = await supabase
      .from('device_batches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    return data.map(batch => ({
      id: batch.id,
      name: batch.name,
      batch_id: batch.batch_id,
      type: batch.device_type as 'card' | 'wristband',
      quantity: batch.quantity,
      available: batch.available,
      allocated: batch.allocated,
      date: batch.created_at
    }));
  } catch (error) {
    console.error("Error fetching recent batches:", error);
    return [];
  }
}

// Fetch unallocated devices
export async function fetchUnallocatedDevices(): Promise<UnallocatedDevice[]> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        id, serial_number, device_type, status, batch_id, created_at,
        school:school_id (name),
        student:student_id (name)
      `)
      .is('student_id', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as UnallocatedDevice[];
  } catch (error) {
    console.error("Error fetching unallocated devices:", error);
    return [];
  }
}

// React Query hooks
export function useDeviceStatistics() {
  return useQuery({
    queryKey: ['deviceStatistics'],
    queryFn: fetchDeviceStatistics,
  });
}

export function useDeviceAllocation() {
  return useQuery({
    queryKey: ['deviceAllocation'],
    queryFn: fetchDeviceAllocationBySchool,
  });
}

// Add the missing hooks
export function useDeviceStats() {
  return useQuery({
    queryKey: ['deviceStats'],
    queryFn: fetchDeviceStatistics,
  });
}

export function useRecentBatches() {
  return useQuery({
    queryKey: ['recentBatches'],
    queryFn: fetchRecentBatches,
  });
}

export function useUnallocatedDevices() {
  return useQuery({
    queryKey: ['unallocatedDevices'],
    queryFn: fetchUnallocatedDevices,
  });
}

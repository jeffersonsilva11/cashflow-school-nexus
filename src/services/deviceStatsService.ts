
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Device } from "@/services/deviceService";

export type DeviceStats = {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  transit: number;
};

export type DeviceAllocationData = {
  name: string;
  value: number;
};

export type DeviceBatchData = {
  id: string;
  name: string;
  type: string;
  quantity: number;
  available: number;
  allocated: number;
  date: string;
};

// Função para buscar estatísticas gerais dos dispositivos
export async function fetchDeviceStats(): Promise<DeviceStats> {
  try {
    // Total de dispositivos
    const { count: totalDevices } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true });

    // Dispositivos ativos
    const { count: activeDevices } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Dispositivos inativos
    const { count: inactiveDevices } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'inactive');

    // Dispositivos pendentes
    const { count: pendingDevices } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Dispositivos em trânsito
    const { count: transitDevices } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'transit');

    return {
      total: totalDevices || 0,
      active: activeDevices || 0,
      inactive: inactiveDevices || 0,
      pending: pendingDevices || 0,
      transit: transitDevices || 0
    };
  } catch (error) {
    console.error("Error fetching device statistics:", error);
    return {
      total: 0,
      active: 0,
      inactive: 0,
      pending: 0,
      transit: 0
    };
  }
}

// Função para buscar alocação de dispositivos por escola
export async function fetchDeviceAllocation(): Promise<DeviceAllocationData[]> {
  try {
    // Buscar todas as escolas
    const { data: schools } = await supabase
      .from('schools')
      .select('id, name');

    if (!schools || schools.length === 0) return [];

    // Para cada escola, contar quantos dispositivos estão alocados
    const allocations = await Promise.all(
      schools.map(async (school) => {
        const { count } = await supabase
          .from('devices')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', school.id);

        return {
          name: school.name,
          value: count || 0
        };
      })
    );

    // Filtrar escolas com pelo menos 1 dispositivo e ordenar por quantidade
    return allocations
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error("Error fetching device allocation:", error);
    return [];
  }
}

// Função para buscar lotes recentes de dispositivos
export async function fetchRecentBatches(): Promise<DeviceBatchData[]> {
  try {
    const { data, error } = await supabase
      .from('device_batches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    return data.map(batch => ({
      id: batch.batch_id,
      name: batch.name,
      type: batch.device_type,
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

// Interface para dispositivos não alocados que seja compatível com UnallocatedDevice
export interface UnallocatedDeviceData {
  id?: string;
  serial?: string;
  type?: string;
  status?: string;
  batch?: string;
  serial_number?: string;
  device_type?: string;
  batch_id?: string;
}

// Função para buscar dispositivos não alocados
export async function fetchUnallocatedDevices(): Promise<UnallocatedDeviceData[]> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('id, serial_number, device_type, status, batch_id')
      .is('student_id', null)
      .limit(10);
    
    if (error) throw error;
    
    return data.map(device => ({
      id: device.id,
      serial: device.serial_number,
      serial_number: device.serial_number,
      type: device.device_type,
      device_type: device.device_type,
      status: device.status,
      batch: device.batch_id,
      batch_id: device.batch_id
    }));
  } catch (error) {
    console.error("Error fetching unallocated devices:", error);
    return [];
  }
}

// React Query hooks
export function useDeviceStats() {
  return useQuery({
    queryKey: ['deviceStats'],
    queryFn: fetchDeviceStats,
  });
}

export function useDeviceAllocation() {
  return useQuery({
    queryKey: ['deviceAllocation'],
    queryFn: fetchDeviceAllocation,
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


import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface DeviceLog {
  id: string;
  device_id: string;
  log_type: string;
  description: string;
  metadata?: any;
  created_at: string;
}

export async function fetchDeviceLogs() {
  try {
    const { data, error } = await supabase
      .from('device_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    return data as DeviceLog[];
  } catch (error) {
    console.error("Error fetching device logs:", error);
    throw error;
  }
}

export async function fetchDeviceLogsById(deviceId: string) {
  try {
    const { data, error } = await supabase
      .from('device_logs')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return data as DeviceLog[];
  } catch (error) {
    console.error(`Error fetching logs for device ${deviceId}:`, error);
    throw error;
  }
}

export async function createDeviceLog(log: Omit<DeviceLog, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('device_logs')
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data as DeviceLog;
  } catch (error) {
    console.error("Error creating device log:", error);
    throw error;
  }
}

// React Query hooks
export function useDeviceLogs() {
  return useQuery({
    queryKey: ['device-logs'],
    queryFn: fetchDeviceLogs,
  });
}

export function useDeviceLogsById(deviceId: string | undefined) {
  return useQuery({
    queryKey: ['device-logs', deviceId],
    queryFn: () => fetchDeviceLogsById(deviceId as string),
    enabled: !!deviceId,
  });
}

export function useCreateDeviceLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDeviceLog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['device-logs'] });
      queryClient.invalidateQueries({ queryKey: ['device-logs', data.device_id] });
    }
  });
}

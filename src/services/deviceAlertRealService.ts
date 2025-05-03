
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface DeviceAlertReal {
  id: string;
  device_id: string;
  alert_type: string;
  severity: string;
  message: string;
  status: string;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchDeviceAlerts() {
  try {
    const { data, error } = await supabase
      .from('device_alerts')
      .select(`
        *,
        device:device_id(id, serial_number, device_type)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching device alerts:", error);
    throw error;
  }
}

export async function fetchActiveDeviceAlerts() {
  try {
    const { data, error } = await supabase
      .from('device_alerts')
      .select(`
        *,
        device:device_id(id, serial_number, device_type)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching active device alerts:", error);
    throw error;
  }
}

export async function fetchDeviceAlertsByDevice(deviceId: string) {
  try {
    const { data, error } = await supabase
      .from('device_alerts')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as DeviceAlertReal[];
  } catch (error) {
    console.error(`Error fetching alerts for device ${deviceId}:`, error);
    throw error;
  }
}

export async function createDeviceAlert(alert: Omit<DeviceAlertReal, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('device_alerts')
      .insert(alert)
      .select()
      .single();
    
    if (error) throw error;
    return data as DeviceAlertReal;
  } catch (error) {
    console.error("Error creating device alert:", error);
    throw error;
  }
}

export async function resolveDeviceAlert(alertId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('device_alerts')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: userId
      })
      .eq('id', alertId)
      .select()
      .single();
    
    if (error) throw error;
    return data as DeviceAlertReal;
  } catch (error) {
    console.error(`Error resolving device alert ${alertId}:`, error);
    throw error;
  }
}

// React Query hooks
export function useDeviceAlerts() {
  return useQuery({
    queryKey: ['device-alerts'],
    queryFn: fetchDeviceAlerts,
  });
}

export function useActiveDeviceAlerts() {
  return useQuery({
    queryKey: ['device-alerts', 'active'],
    queryFn: fetchActiveDeviceAlerts,
  });
}

export function useDeviceAlertsByDevice(deviceId: string | undefined) {
  return useQuery({
    queryKey: ['device-alerts', 'device', deviceId],
    queryFn: () => fetchDeviceAlertsByDevice(deviceId as string),
    enabled: !!deviceId,
  });
}

export function useCreateDeviceAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDeviceAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-alerts'] });
      toast({ title: "Alerta criado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar alerta", 
        description: error.message || "Ocorreu um erro ao criar o alerta",
        variant: "destructive" 
      });
    }
  });
}

export function useResolveDeviceAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ alertId, userId }: { alertId: string, userId: string }) => 
      resolveDeviceAlert(alertId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['device-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['device-alerts', 'device', data.device_id] });
      toast({ title: "Alerta resolvido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao resolver alerta", 
        description: error.message || "Ocorreu um erro ao resolver o alerta",
        variant: "destructive" 
      });
    }
  });
}

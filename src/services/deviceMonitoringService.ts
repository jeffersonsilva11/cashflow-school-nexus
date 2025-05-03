
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types for device monitoring
export interface DeviceStatus {
  id: string;
  device_id: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  battery_level?: number;
  signal_strength?: number;
  last_seen_at: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  updated_at: string;
}

export interface DeviceAlert {
  id: string;
  device_id: string;
  alert_type: 'battery_low' | 'connection_lost' | 'unauthorized_access' | 'location_change' | 'offline' | 'error';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  status: 'active' | 'resolved' | 'acknowledged';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

// Fetch real-time device statuses
export const fetchDeviceStatuses = async (): Promise<DeviceStatus[]> => {
  const { data, error } = await supabase
    .from('device_statuses')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data as DeviceStatus[];
};

// Fetch active alerts
export const fetchActiveAlerts = async (): Promise<DeviceAlert[]> => {
  const { data, error } = await supabase
    .from('device_alerts')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as DeviceAlert[];
};

// Acknowledge an alert
export const acknowledgeAlert = async (alertId: string): Promise<DeviceAlert> => {
  const { data, error } = await supabase
    .from('device_alerts')
    .update({ status: 'acknowledged', updated_at: new Date().toISOString() })
    .eq('id', alertId)
    .select()
    .single();
  
  if (error) throw error;
  return data as DeviceAlert;
};

// Resolve an alert
export const resolveAlert = async (alertId: string, userId: string): Promise<DeviceAlert> => {
  const { data, error } = await supabase
    .from('device_alerts')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: userId,
      updated_at: new Date().toISOString()
    })
    .eq('id', alertId)
    .select()
    .single();
  
  if (error) throw error;
  return data as DeviceAlert;
};

// Create a new alert
export const createAlert = async (alert: Omit<DeviceAlert, 'id' | 'created_at' | 'updated_at'>): Promise<DeviceAlert> => {
  const { data, error } = await supabase
    .from('device_alerts')
    .insert({
      ...alert,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as DeviceAlert;
};

// Subscribe to real-time device updates
export const subscribeToDeviceUpdates = (onUpdate: (device: any) => void) => {
  const channel = supabase
    .channel('device-updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'tablets' }, 
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

// Subscribe to real-time alerts
export const subscribeToAlerts = (onAlert: (alert: any) => void) => {
  const channel = supabase
    .channel('device-alerts')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'device_alerts' }, 
      (payload) => {
        onAlert(payload.new);
        
        // Show a toast notification for new alerts
        toast({
          title: `Alert: ${payload.new.alert_type}`,
          description: payload.new.message,
          variant: payload.new.severity === 'critical' ? 'destructive' : 
                  payload.new.severity === 'warning' ? 'default' : 'default',
        });
      }
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

// React Query hooks
export const useDeviceStatuses = () => {
  return useQuery({
    queryKey: ['device-statuses'],
    queryFn: fetchDeviceStatuses,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useActiveAlerts = () => {
  return useQuery({
    queryKey: ['active-alerts'],
    queryFn: fetchActiveAlerts,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: acknowledgeAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-alerts'] });
      toast({ title: 'Alert acknowledged' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to acknowledge alert',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ alertId, userId }: { alertId: string, userId: string }) => 
      resolveAlert(alertId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-alerts'] });
      toast({ title: 'Alert resolved' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to resolve alert',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-alerts'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create alert',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

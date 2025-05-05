
import { supabase } from "@/integrations/supabase/client";

// Função para buscar relatórios de status dos dispositivos
export const fetchDeviceStatusReport = async () => {
  try {
    const { data, error } = await supabase
      .from('device_status_reports')
      .select('*')
      .order('count', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching device status report:", error);
    return null;
  }
};

// Função para buscar relatórios de bateria dos dispositivos
export const fetchDeviceBatteryReport = async () => {
  try {
    const { data, error } = await supabase
      .from('device_battery_reports')
      .select('*')
      .order('level', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching device battery report:", error);
    return null;
  }
};

// Função para buscar relatórios de uso dos dispositivos
export const fetchDeviceUsageReport = async () => {
  try {
    const { data, error } = await supabase
      .from('device_usage_reports')
      .select('*')
      .order('month', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching device usage report:", error);
    return null;
  }
};

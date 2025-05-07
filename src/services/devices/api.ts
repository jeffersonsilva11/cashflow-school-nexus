
import { supabase } from "@/integrations/supabase/client";

// Função para buscar relatórios de status dos dispositivos
export const fetchDeviceStatusReport = async () => {
  try {
    // Tentar buscar da tabela financial_reports com o tipo específico
    const { data: reportData, error: reportError } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', 'device_status')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (reportError) {
      console.error("Error fetching from financial_reports:", reportError);
      
      // Se não encontrar dados na tabela financial_reports, tenta buscar da tabela devices
      // e processar manualmente
      const { data: devicesData, error: devicesError } = await supabase
        .from('devices')
        .select('status');
      
      if (devicesError) throw devicesError;
      
      // Se encontrou dados de dispositivos, processa para o formato esperado
      if (devicesData && devicesData.length > 0) {
        // Agrupando manualmente pelo status
        const statusCount: Record<string, number> = {};
        devicesData.forEach(device => {
          const status = device.status || 'Unknown';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        
        // Calculando total e porcentagens
        const total = Object.values(statusCount).reduce((sum, count) => sum + count, 0);
        
        // Formatando para o formato esperado
        return Object.entries(statusCount).map(([status, count]) => ({
          status,
          count,
          percentage: Math.round((count / total) * 100)
        }));
      }
      
      return null;
    }
    
    if (reportData && reportData.length > 0 && reportData[0].data) {
      return reportData[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching device status report:", error);
    return null;
  }
};

// Função para buscar relatórios de bateria dos dispositivos
export const fetchDeviceBatteryReport = async () => {
  try {
    // Buscar da tabela financial_reports
    const { data: reportData, error: reportError } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', 'device_battery')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (reportError) {
      console.error("Error fetching from financial_reports:", reportError);
      
      // Se não encontrar na tabela financial_reports, buscar da device_statuses e processar
      const { data: deviceStatus, error: deviceStatusError } = await supabase
        .from('device_statuses')
        .select('battery_level')
        .not('battery_level', 'is', null);
      
      if (deviceStatusError) throw deviceStatusError;
      
      if (deviceStatus && deviceStatus.length > 0) {
        // Agrupar em categorias de bateria
        const batteryLevels: Record<string, number> = {
          '90-100%': 0,
          '70-90%': 0,
          '50-70%': 0,
          '30-50%': 0,
          '0-30%': 0
        };
        
        deviceStatus.forEach(item => {
          const level = item.battery_level || 0;
          if (level >= 90) {
            batteryLevels['90-100%']++;
          } else if (level >= 70) {
            batteryLevels['70-90%']++;
          } else if (level >= 50) {
            batteryLevels['50-70%']++;
          } else if (level >= 30) {
            batteryLevels['30-50%']++;
          } else {
            batteryLevels['0-30%']++;
          }
        });
        
        // Calcular total e percentuais
        const total = Object.values(batteryLevels).reduce((sum, count) => sum + count, 0);
        
        // Formatar para o formato esperado
        return Object.entries(batteryLevels).map(([level, count]) => ({
          level,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }));
      }
      
      return null;
    }
    
    if (reportData && reportData.length > 0 && reportData[0].data) {
      return reportData[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching device battery report:", error);
    return null;
  }
};

// Função para buscar relatórios de uso dos dispositivos
export const fetchDeviceUsageReport = async () => {
  try {
    // Tentar buscar da tabela específica de uso de dispositivos
    const { data: usageData, error: usageError } = await supabase
      .from('device_usage_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usageError) {
      console.error("Error fetching from device_usage_reports:", usageError);
      
      // Fallback para buscar da tabela financial_reports com o tipo específico
      const { data: reportData, error: reportError } = await supabase
        .from('financial_reports')
        .select('*')
        .eq('report_type', 'device_usage')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (reportError) throw reportError;
      
      // Se encontrar um relatório, retorne os dados específicos dele
      if (reportData && reportData.length > 0 && reportData[0].data) {
        return reportData[0].data;
      }
    }
    
    if (usageData && usageData.length > 0) {
      return usageData;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching device usage report:", error);
    return null;
  }
};

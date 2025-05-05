
import { supabase } from "@/integrations/supabase/client";

// Função para buscar relatórios de status dos dispositivos
export const fetchDeviceStatusReport = async () => {
  try {
    // Modificando para buscar da tabela de dispositivos e agrupar os dados
    const { data, error } = await supabase
      .from('devices')
      .select('status, count(*)')
      .group('status');
    
    if (error) throw error;
    
    // Transforme os resultados para o formato esperado
    if (data) {
      // Calculando o total para obter a porcentagem
      const total = data.reduce((sum, item) => sum + item.count, 0);
      
      return data.map(item => ({
        status: item.status,
        count: item.count,
        percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
      }));
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
    // Note: Como não temos dados de bateria detalhados, iremos buscar da tabela
    // device_statuses que tem battery_level 
    const { data, error } = await supabase
      .from('device_statuses')
      .select('battery_level, count(*)')
      .not('battery_level', 'is', null)
      .group('battery_level');
    
    if (error) throw error;
    
    // Transforme os resultados para o formato esperado
    if (data) {
      // Agrupando em faixas
      const batteryRanges = {
        '90-100%': { count: 0, percentage: 0 },
        '70-90%': { count: 0, percentage: 0 },
        '50-70%': { count: 0, percentage: 0 },
        '30-50%': { count: 0, percentage: 0 },
        '0-30%': { count: 0, percentage: 0 }
      };
      
      data.forEach(item => {
        const level = item.battery_level;
        if (level >= 90) {
          batteryRanges['90-100%'].count += item.count;
        } else if (level >= 70) {
          batteryRanges['70-90%'].count += item.count;
        } else if (level >= 50) {
          batteryRanges['50-70%'].count += item.count;
        } else if (level >= 30) {
          batteryRanges['30-50%'].count += item.count;
        } else {
          batteryRanges['0-30%'].count += item.count;
        }
      });
      
      // Calculando o total e as porcentagens
      const total = Object.values(batteryRanges).reduce((sum, item) => sum + item.count, 0);
      
      return Object.entries(batteryRanges).map(([level, data]) => ({
        level,
        count: data.count,
        percentage: total > 0 ? Math.round((data.count / total) * 100) : 0
      }));
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
    // Para o relatório de uso, precisaríamos de dados históricos
    // Como isso não está prontamente disponível, vamos buscar da tabela financial_reports
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', 'device_usage')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // Se encontrar um relatório, retorne os dados específicos dele
    if (data && data.length > 0 && data[0].data) {
      return data[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching device usage report:", error);
    return null;
  }
};

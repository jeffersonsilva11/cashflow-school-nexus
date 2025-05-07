
import { useQuery } from '@tanstack/react-query';
import { 
  fetchDeviceStatusReport, 
  fetchDeviceBatteryReport, 
  fetchDeviceUsageReport 
} from './devices/api';
import { 
  getMockDeviceStatusData, 
  getMockDeviceBatteryData, 
  getMockDeviceUsageData 
} from './devices/mock';
import { 
  DeviceStatusData, 
  DeviceBatteryData, 
  DeviceUsageData 
} from './devices/reportService';

export const useDeviceStatusReport = () => {
  return useQuery<DeviceStatusData[]>({
    queryKey: ['device-status-report'],
    queryFn: async () => {
      try {
        const reportData = await fetchDeviceStatusReport();
        
        if (reportData) {
          // Verificar se reportData é um array antes de acessar a propriedade length
          if (Array.isArray(reportData) && reportData.length > 0) {
            // Garantir que os dados correspondam ao tipo DeviceStatusData
            return reportData.map((item: any) => ({
              status: item.status || '',
              count: item.count || 0,
              percentage: item.percentage || 0
            }));
          }
        }
        
        // Se não houver relatório no banco, usar dados mockados
        return getMockDeviceStatusData();
      } catch (error) {
        console.error("Error in useDeviceStatusReport:", error);
        return getMockDeviceStatusData();
      }
    },
    refetchOnWindowFocus: false
  });
};

export const useDeviceBatteryReport = () => {
  return useQuery<DeviceBatteryData[]>({
    queryKey: ['device-battery-report'],
    queryFn: async () => {
      try {
        const reportData = await fetchDeviceBatteryReport();
        
        if (reportData) {
          // Verificar se reportData é um array antes de acessar a propriedade length
          if (Array.isArray(reportData) && reportData.length > 0) {
            // Garantir que os dados correspondam ao tipo DeviceBatteryData
            return reportData.map((item: any) => ({
              level: item.level || '',
              count: item.count || 0,
              percentage: item.percentage || 0
            }));
          }
        }
        
        // Se não houver relatório no banco, usar dados mockados
        return getMockDeviceBatteryData();
      } catch (error) {
        console.error("Error in useDeviceBatteryReport:", error);
        return getMockDeviceBatteryData();
      }
    },
    refetchOnWindowFocus: false
  });
};

export const useDeviceUsageReport = () => {
  return useQuery<DeviceUsageData[]>({
    queryKey: ['device-usage-report'],
    queryFn: async () => {
      try {
        const reportData = await fetchDeviceUsageReport();
        
        if (reportData) {
          // Verificar se reportData é um array antes de usar métodos de array
          if (Array.isArray(reportData)) {
            // Garantir que os dados correspondam ao tipo DeviceUsageData
            return reportData.map((item: any) => ({
              month: item.month || '',
              daily_active: item.daily_active || 0,
              monthly_active: item.monthly_active || 0,
              total: item.total || 0
            }));
          }
        }
        
        // Se não houver relatório no banco, usar dados mockados
        return getMockDeviceUsageData();
      } catch (error) {
        console.error("Error in useDeviceUsageReport:", error);
        return getMockDeviceUsageData();
      }
    },
    refetchOnWindowFocus: false
  });
};

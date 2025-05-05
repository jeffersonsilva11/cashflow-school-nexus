
import { fetchDeviceStatusReport, fetchDeviceBatteryReport, fetchDeviceUsageReport } from './api';
import { getMockDeviceStatusData, getMockDeviceBatteryData, getMockDeviceUsageData } from './mock';

// Tipos de dados para os relatórios de dispositivos
export type DeviceStatusData = {
  status: string;
  count: number;
  percentage: number;
};

export type DeviceBatteryData = {
  level: string;
  count: number;
  percentage: number;
};

export type DeviceUsageData = {
  month: string;
  daily_active: number;
  monthly_active: number;
  total: number;
};

// Função para gerar relatório de status dos dispositivos
export const generateDeviceStatusReport = async (): Promise<DeviceStatusData[]> => {
  try {
    const reportData = await fetchDeviceStatusReport();
    
    if (reportData && reportData.length > 0) {
      // Garantir que os dados correspondam ao tipo DeviceStatusData
      return reportData.map((item: any) => ({
        status: item.status || '',
        count: item.count || 0,
        percentage: item.percentage || 0
      })) as DeviceStatusData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockDeviceStatusData();
  } catch (error) {
    console.error("Error generating device status report:", error);
    return getMockDeviceStatusData();
  }
};

// Função para gerar relatório de bateria dos dispositivos
export const generateDeviceBatteryReport = async (): Promise<DeviceBatteryData[]> => {
  try {
    const reportData = await fetchDeviceBatteryReport();
    
    if (reportData && reportData.length > 0) {
      // Garantir que os dados correspondam ao tipo DeviceBatteryData
      return reportData.map((item: any) => ({
        level: item.level || '',
        count: item.count || 0,
        percentage: item.percentage || 0
      })) as DeviceBatteryData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockDeviceBatteryData();
  } catch (error) {
    console.error("Error generating device battery report:", error);
    return getMockDeviceBatteryData();
  }
};

// Função para gerar relatório de uso dos dispositivos
export const generateDeviceUsageReport = async (): Promise<DeviceUsageData[]> => {
  try {
    const reportData = await fetchDeviceUsageReport();
    
    if (reportData && Array.isArray(reportData)) {
      // Garantir que os dados correspondam ao tipo DeviceUsageData
      return reportData.map((item: any) => ({
        month: item.month || '',
        daily_active: item.daily_active || 0,
        monthly_active: item.monthly_active || 0,
        total: item.total || 0
      })) as DeviceUsageData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockDeviceUsageData();
  } catch (error) {
    console.error("Error generating device usage report:", error);
    return getMockDeviceUsageData();
  }
};

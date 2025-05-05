
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
    const report = await fetchDeviceStatusReport();
    
    if (report && report.length > 0) {
      return report as DeviceStatusData[];
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
    const report = await fetchDeviceBatteryReport();
    
    if (report && report.length > 0) {
      return report as DeviceBatteryData[];
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
    const report = await fetchDeviceUsageReport();
    
    if (report && report.length > 0) {
      return report as DeviceUsageData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockDeviceUsageData();
  } catch (error) {
    console.error("Error generating device usage report:", error);
    return getMockDeviceUsageData();
  }
};


import { useQuery } from "@tanstack/react-query";
import {
  generateDeviceStatusReport,
  generateDeviceBatteryReport,
  generateDeviceUsageReport,
  DeviceStatusData,
  DeviceBatteryData,
  DeviceUsageData
} from './devices/reportService';

// React Query hooks for device report generation
export function useDeviceStatusReport() {
  return useQuery<DeviceStatusData[], Error>({
    queryKey: ['device-status'],
    queryFn: generateDeviceStatusReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDeviceBatteryReport() {
  return useQuery<DeviceBatteryData[], Error>({
    queryKey: ['device-battery'],
    queryFn: generateDeviceBatteryReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDeviceUsageReport() {
  return useQuery<DeviceUsageData[], Error>({
    queryKey: ['device-usage'],
    queryFn: generateDeviceUsageReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

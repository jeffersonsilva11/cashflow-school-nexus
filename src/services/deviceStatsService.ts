
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Get device statistics 
export async function fetchDeviceStatistics() {
  try {
    // Count devices by status
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('status');
    
    if (devicesError) throw devicesError;
    
    // Count devices by status
    const active = devices.filter(d => d.status === 'active').length;
    const inactive = devices.filter(d => d.status === 'inactive').length;
    const pending = devices.filter(d => d.status === 'pending').length;
    const transit = devices.filter(d => d.status === 'in_transit').length;
    
    return {
      active,
      inactive,
      pending,
      transit,
      total: devices.length
    };
  } catch (error) {
    console.error("Error fetching device statistics:", error);
    return { active: 0, inactive: 0, pending: 0, transit: 0, total: 0 };
  }
}

// Get allocation of devices by school (top schools)
export async function fetchDeviceAllocationBySchool() {
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name');
      
    if (schoolsError) throw schoolsError;
    
    const schoolsWithDevices = await Promise.all(
      schools.map(async (school) => {
        const { count, error: countError } = await supabase
          .from('devices')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', school.id);
          
        if (countError) throw countError;
        
        return {
          name: school.name,
          devices: count || 0
        };
      })
    );
    
    // Sort schools by number of devices in descending order
    return schoolsWithDevices.sort((a, b) => b.devices - a.devices);
  } catch (error) {
    console.error("Error fetching device allocation by school:", error);
    return [];
  }
}

// React Query hooks
export function useDeviceStatistics() {
  return useQuery({
    queryKey: ['deviceStatistics'],
    queryFn: fetchDeviceStatistics,
  });
}

export function useDeviceAllocation() {
  return useQuery({
    queryKey: ['deviceAllocation'],
    queryFn: fetchDeviceAllocationBySchool,
  });
}

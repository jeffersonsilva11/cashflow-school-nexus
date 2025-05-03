
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceStatusChart } from '@/components/devices/DeviceStatusChart';
import { DeviceAllocationChart } from '@/components/devices/DeviceAllocationChart';
import { useDeviceAllocation } from '@/services/deviceStatsService';

interface DeviceChartsProps {
  deviceStats: {
    active: number;
    inactive: number;
    pending: number;
    transit: number;
  };
}

export const DeviceCharts = ({ deviceStats }: DeviceChartsProps) => {
  const { data: schoolAllocationData = [], isLoading } = useDeviceAllocation();
  
  // Limitar a 5 escolas com mais dispositivos
  const topSchools = [...schoolAllocationData].slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Status dos Dispositivos</CardTitle>
              <CardDescription>Distribuição por status atual</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <DeviceStatusChart data={deviceStats} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Alocação por Escola</CardTitle>
              <CardDescription>Top 5 escolas com mais dispositivos</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
              <span className="text-muted-foreground">Carregando dados...</span>
            </div>
          ) : topSchools.length > 0 ? (
            <DeviceAllocationChart data={topSchools} />
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <span className="text-muted-foreground">Nenhum dado de alocação encontrado</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

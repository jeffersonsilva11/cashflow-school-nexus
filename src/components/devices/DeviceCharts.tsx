
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceStatusChart } from '@/components/devices/DeviceStatusChart';
import { DeviceAllocationChart } from '@/components/devices/DeviceAllocationChart';

interface DeviceChartsProps {
  deviceStats: {
    active: number;
    inactive: number;
    pending: number;
    transit: number;
  };
}

export const DeviceCharts = ({ deviceStats }: DeviceChartsProps) => {
  // Mock data for device allocation by school
  const schoolAllocationData = [
    { name: 'Escola São Paulo', value: 1892 },
    { name: 'Colégio Dom Bosco', value: 1456 },
    { name: 'Instituto Futuro', value: 1245 },
    { name: 'Escola Estadual Central', value: 987 },
    { name: 'Colégio Santa Maria', value: 843 }
  ];

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
          <DeviceAllocationChart data={schoolAllocationData} />
        </CardContent>
      </Card>
    </div>
  );
};


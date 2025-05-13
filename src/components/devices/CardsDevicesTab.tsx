
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RecentBatchesSection } from './RecentBatchesSection';
import { DeviceStatsCards } from './DeviceStatsCards';
import { UnallocatedDevicesTable } from './UnallocatedDevicesTable';
import { 
  useDeviceStats, 
  useDeviceAllocation,
  useRecentBatches,
  useUnallocatedDevices
} from '@/services/deviceStatsService';
import { DeviceAllocationChart } from './DeviceAllocationChart';

export const CardsDevicesTab: React.FC = () => {
  const { data: deviceStats, isLoading: statsLoading } = useDeviceStats();
  const { data: deviceAllocation, isLoading: allocationLoading } = useDeviceAllocation();
  const { data: recentBatches, isLoading: batchesLoading } = useRecentBatches();
  const { data: unallocatedDevices, isLoading: unallocatedLoading } = useUnallocatedDevices();
  
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Statistics Cards */}
      <div className="grid col-span-3 gap-6 md:grid-cols-4">
        <DeviceStatsCards 
          active={deviceStats?.active || 0} 
          inactive={deviceStats?.inactive || 0}
          pending={deviceStats?.pending || 0}
          transit={deviceStats?.transit || 0}
          isLoading={statsLoading}
        />
      </div>
      
      {/* Actions Card */}
      <Card className="col-span-3 lg:col-span-1">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Gerenciamento de dispositivos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild className="w-full justify-start">
            <Link to="/deviceManagement/RegisterDevice">
              Registrar Novo Dispositivo
            </Link>
          </Button>
          <Button asChild className="w-full justify-start" variant="outline">
            <Link to="/deviceManagement/AllocateToSchool">
              Alocar para Escola
            </Link>
          </Button>
          <Button asChild className="w-full justify-start" variant="outline">
            <Link to="/deviceManagement/BindToStudents">
              Vincular a Estudante
            </Link>
          </Button>
          <Button asChild className="w-full justify-start" variant="outline">
            <Link to="/deviceBatches">
              Gerenciar Lotes
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      {/* Allocation Chart */}
      <Card className="col-span-3 lg:col-span-2">
        <CardHeader>
          <CardTitle>Alocação por Escola</CardTitle>
          <CardDescription>Quantidade de dispositivos por escola</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <DeviceAllocationChart 
            data={deviceAllocation || []} 
            isLoading={allocationLoading} 
          />
        </CardContent>
      </Card>
      
      {/* Recent Batches Section */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Lotes Recentes</CardTitle>
          <CardDescription>Últimos lotes de dispositivos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentBatchesSection 
            batches={recentBatches || []} 
            isLoading={batchesLoading}
          />
        </CardContent>
      </Card>
      
      {/* Unallocated Devices */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Dispositivos não alocados</CardTitle>
          <CardDescription>Dispositivos aguardando alocação para estudantes</CardDescription>
        </CardHeader>
        <CardContent>
          <UnallocatedDevicesTable 
            devices={unallocatedDevices || []} 
            isLoading={unallocatedLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

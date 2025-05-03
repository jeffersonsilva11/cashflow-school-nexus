
import React, { useState } from 'react';
import { CardDeviceStats } from './DeviceStatsCards';
import { DeviceCharts } from './DeviceCharts';
import { RecentBatchesSection } from './RecentBatchesSection';
import { UnallocatedDevicesTable } from './UnallocatedDevicesTable';
import { Card, CardContent } from '@/components/ui/card';
import { NewBatchDialog } from './NewBatchDialog';
import { 
  useDeviceStats, 
  useRecentBatches, 
  useUnallocatedDevices 
} from '@/services/deviceStatsService';

export const CardsDevicesTab = () => {
  const [openLotDialog, setOpenLotDialog] = useState(false);
  
  const { data: deviceStats, isLoading: isStatsLoading } = useDeviceStats();
  const { data: recentBatches = [], isLoading: isBatchesLoading } = useRecentBatches();
  const { data: unallocatedDevices = [], isLoading: isDevicesLoading } = useUnallocatedDevices();
  
  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
        <span>Carregando estatísticas de dispositivos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CardDeviceStats cardStats={deviceStats || {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        transit: 0
      }} />
      
      <DeviceCharts deviceStats={{
        active: deviceStats?.active || 0,
        inactive: deviceStats?.inactive || 0,
        pending: deviceStats?.pending || 0,
        transit: deviceStats?.transit || 0
      }} />
      
      <div className="grid grid-cols-1 gap-6">
        <RecentBatchesSection 
          batches={recentBatches} 
          onNewBatch={() => setOpenLotDialog(true)}
          isLoading={isBatchesLoading}
        />
        
        <Card>
          <CardContent className="pt-6">
            <UnallocatedDevicesTable 
              devices={unallocatedDevices} 
              isLoading={isDevicesLoading}
            />
          </CardContent>
        </Card>
      </div>
      
      <NewBatchDialog open={openLotDialog} onOpenChange={setOpenLotDialog} />
    </div>
  );
};

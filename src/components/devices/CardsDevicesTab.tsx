
import React, { useState } from 'react';
import { CardDeviceStats } from './DeviceStatsCards';
import { DeviceCharts } from './DeviceCharts';
import { RecentBatchesSection } from './RecentBatchesSection';
import { UnallocatedDevicesTable } from './UnallocatedDevicesTable';
import { Card, CardContent } from '@/components/ui/card';
import { NewBatchDialog } from './NewBatchDialog';

export const CardsDevicesTab = () => {
  const [openLotDialog, setOpenLotDialog] = useState(false);
  
  // Dados mockados para cartões/pulseiras
  const cardStats = {
    total: 12458,
    active: 10874,
    inactive: 620,
    pending: 458,
    transit: 506
  };
  
  // Dados mockados para lotes recentes
  const recentBatches = [
    { id: 'LOT-2023-05A', name: 'Lote Maio 2023 - Cartões', type: 'card', quantity: 1500, available: 342, allocated: 1158, date: '2023-05-10' },
    { id: 'LOT-2023-06B', name: 'Lote Junho 2023 - Pulseiras', type: 'wristband', quantity: 2000, available: 230, allocated: 1770, date: '2023-06-15' },
    { id: 'LOT-2023-08C', name: 'Lote Agosto 2023 - Cartões Premium', type: 'card', quantity: 1200, available: 120, allocated: 1080, date: '2023-08-22' }
  ];
  
  // Dados mockados para dispositivos não alocados
  const unallocatedDevices = [
    { serial: 'CARD-2023-8742', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
    { serial: 'WBAND-2023-3641', type: 'Pulseira', status: 'pending', batch: 'LOT-2023-06B' },
    { serial: 'CARD-2023-9134', type: 'Cartão Premium', status: 'active', batch: 'LOT-2023-08C' },
    { serial: 'WBAND-2023-5192', type: 'Pulseira', status: 'inactive', batch: 'LOT-2023-06B' },
    { serial: 'CARD-2023-6723', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
  ];

  return (
    <div className="space-y-6">
      <CardDeviceStats cardStats={cardStats} />
      
      <DeviceCharts deviceStats={{
        active: cardStats.active,
        inactive: cardStats.inactive,
        pending: cardStats.pending,
        transit: cardStats.transit
      }} />
      
      <div className="grid grid-cols-1 gap-6">
        <RecentBatchesSection 
          batches={recentBatches} 
          onNewBatch={() => setOpenLotDialog(true)}
        />
        
        <Card>
          <CardContent className="pt-6">
            <UnallocatedDevicesTable devices={unallocatedDevices} />
          </CardContent>
        </Card>
      </div>
      
      <NewBatchDialog open={openLotDialog} onOpenChange={setOpenLotDialog} />
    </div>
  );
};

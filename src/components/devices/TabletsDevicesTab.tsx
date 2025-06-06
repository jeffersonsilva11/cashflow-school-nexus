
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Plus, School } from 'lucide-react';
import { ExportDataDialog } from '@/components/reports/ExportDataDialog';
import { TabletDeviceStats } from './TabletStatsCards';
import { TabletMonitoring } from './TabletMonitoring';
import { TabletAlertsDashboard } from './TabletAlertsDashboard';
import { TabletsTable } from './TabletsTable';
import { useToast } from '@/hooks/use-toast';
import { RegisterTabletDialog } from './RegisterTabletDialog';
import { useTabletStatistics } from '@/services/tabletService';

export const TabletsDevicesTab = () => {
  const { data: tabletStats, isLoading } = useTabletStatistics();
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  const handleExportData = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados dos tablets estão sendo exportados no formato ${format.toUpperCase()}. Você receberá o download em breve.`
    });
    setTimeout(() => setIsExportDialogOpen(false), 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciamento de Tablets</h2>
        <div className="flex gap-2">
          <Badge variant={tabletStats && tabletStats.offline > 0 ? "destructive" : "outline"} className="gap-1">
            {isLoading ? '...' : tabletStats?.offline || 0} offline
          </Badge>
          <Badge variant="outline" className="gap-1 bg-amber-500 hover:bg-amber-600 text-white">
            {isLoading ? '...' : tabletStats?.batteryLow || 0} bateria baixa
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download size={16} />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TabletDeviceStats stats={tabletStats || {
          total: 0,
          online: 0,
          offline: 0,
          batteryLow: 0,
          alerts: 0,
          pendingActivation: 0
        }} />
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-lg font-semibold">Tablets</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1" 
            onClick={() => setIsRegisterDialogOpen(true)}
          >
            <Plus size={16} />
            Cadastrar Tablet
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1" 
          >
            <School size={16} />
            Alocar para Escola
          </Button>
        </div>
      </div>

      <TabletsTable />
      
      <div className="mt-8">
        <TabletMonitoring />
      </div>
      
      <div className="mt-8">
        <TabletAlertsDashboard />
      </div>
      
      <ExportDataDialog 
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen} 
        onExport={handleExportData} 
      />

      <RegisterTabletDialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      />
    </div>
  );
};


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { ExportDataDialog } from '@/components/reports/ExportDataDialog';
import { TerminalDeviceStats } from './DeviceStatsCards';
import { TerminalsMonitoring } from './TerminalsMonitoring';
import { DeviceAlertsDashboard } from './DeviceAlertsDashboard';
import { useToast } from '@/hooks/use-toast';

export const TerminalsDevicesTab = () => {
  // Dados mockados para maquininhas
  const terminalStats = {
    total: 245,
    online: 235,
    offline: 10
  };

  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleExportData = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados dos terminais estão sendo exportados no formato ${format.toUpperCase()}. Você receberá o download em breve.`
    });
    setTimeout(() => setIsExportDialogOpen(false), 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Monitoramento de Terminais</h2>
        <div className="flex gap-2">
          <Badge variant={terminalStats.offline > 0 ? "destructive" : "outline"} className="gap-1">
            {terminalStats.offline} offline
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
      
      <TerminalDeviceStats terminalStats={terminalStats} />
      <TerminalsMonitoring />
      <DeviceAlertsDashboard />
      
      <ExportDataDialog 
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen} 
        onExport={handleExportData} 
      />
    </div>
  );
};

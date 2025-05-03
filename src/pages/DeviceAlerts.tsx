
import React, { useState } from 'react';
import { DeviceMonitoringDashboard } from '@/components/devices/DeviceMonitoringDashboard';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActiveAlerts } from '@/services/deviceMonitoringService';

export default function DeviceAlerts() {
  const { data: activeAlerts } = useActiveAlerts();
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  
  const alertCounts = {
    total: activeAlerts?.length || 0,
    critical: activeAlerts?.filter(a => a.severity === 'critical').length || 0,
    warning: activeAlerts?.filter(a => a.severity === 'warning').length || 0,
    info: activeAlerts?.filter(a => a.severity === 'info').length || 0,
  };

  const exportAlerts = () => {
    // Implementation for exporting alerts to CSV
    if (!activeAlerts || activeAlerts.length === 0) {
      return;
    }
    
    const headers = "ID,Device ID,Type,Severity,Message,Status,Created At\n";
    const csvData = activeAlerts.map(alert => 
      `${alert.id},"${alert.device_id}","${alert.alert_type}","${alert.severity}","${alert.message}","${alert.status}","${alert.created_at}"`
    ).join('\n');
    
    const blob = new Blob([headers + csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `device-alerts-${new Date().toISOString()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alertas de Dispositivos</h1>
          <p className="text-muted-foreground">Monitore alertas e notificações de dispositivos</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportAlerts}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Alertas
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mr-3" />
          <div>
            <p className="text-sm text-amber-700">Alertas Ativos</p>
            <h3 className="text-2xl font-bold text-amber-800">{alertCounts.total}</h3>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
          <div>
            <p className="text-sm text-red-700">Alertas Críticos</p>
            <h3 className="text-2xl font-bold text-red-800">{alertCounts.critical}</h3>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-slate-500 mr-2" />
            <span>Filtrar por severidade:</span>
          </div>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="critical">Críticos</SelectItem>
              <SelectItem value="warning">Avisos</SelectItem>
              <SelectItem value="info">Informações</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator />
      
      <DeviceMonitoringDashboard />
    </div>
  );
}

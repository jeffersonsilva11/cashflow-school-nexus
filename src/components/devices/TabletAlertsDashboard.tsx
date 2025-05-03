
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BatteryLow, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const TabletAlertsDashboard = () => {
  // Dados mockados de alertas
  const alerts = [
    {
      id: 'alert-001',
      deviceId: 'TB045',
      deviceName: 'Tablet Pátio',
      school: 'Escola São Paulo',
      type: 'battery',
      message: 'Bateria crítica (5%)',
      severity: 'high',
      timestamp: '2023-06-01T15:30:00Z',
      status: 'active'
    },
    {
      id: 'alert-002',
      deviceId: 'TB032',
      deviceName: 'Tablet Entrada',
      school: 'Escola Rio de Janeiro',
      type: 'connectivity',
      message: 'Sem conexão há 15 minutos',
      severity: 'medium',
      timestamp: '2023-06-01T14:45:00Z',
      status: 'active'
    },
    {
      id: 'alert-003',
      deviceId: 'TB018',
      deviceName: 'Tablet Biblioteca',
      school: 'Escola Belo Horizonte',
      type: 'system',
      message: 'Erro de sincronização',
      severity: 'low',
      timestamp: '2023-06-01T13:10:00Z',
      status: 'active'
    },
    {
      id: 'alert-004',
      deviceId: 'TB027',
      deviceName: 'Tablet Quadra',
      school: 'Escola Salvador',
      type: 'proximity',
      message: 'Tablet fora da área geográfica permitida',
      severity: 'high',
      timestamp: '2023-06-01T12:05:00Z',
      status: 'resolved'
    }
  ];
  
  // Função para obter ícone de acordo com o tipo de alerta
  const getAlertIcon = (type: string, severity: string) => {
    switch (type) {
      case 'battery':
        return <BatteryLow className="h-4 w-4 text-red-500" />;
      case 'connectivity':
        return <WifiOff className="h-4 w-4 text-amber-500" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'proximity':
        return <AlertTriangle className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  // Função para estilo de acordo com a severidade
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Filtrar alertas ativos
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Alertas de Tablets</CardTitle>
          <Badge variant="outline" className="gap-1 bg-red-100 text-red-800 border-red-200">
            {activeAlerts.length} Ativos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <p className="text-muted-foreground">Nenhum alerta ativo no momento</p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg border p-3 ${getSeverityStyle(alert.severity)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type, alert.severity)}
                  <h3 className="font-medium">{alert.message}</h3>
                </div>
                <Badge variant="outline" className={`${alert.severity === 'high' ? 'bg-white border-red-300 text-red-800' : 
                  alert.severity === 'medium' ? 'bg-white border-amber-300 text-amber-800' : 'bg-white border-blue-300 text-blue-800'}`}>
                  {alert.severity === 'high' ? 'Crítico' : alert.severity === 'medium' ? 'Médio' : 'Baixo'}
                </Badge>
              </div>
              
              <div className="mt-2 text-sm">
                <p><span className="font-medium">Dispositivo:</span> {alert.deviceName} ({alert.deviceId})</p>
                <p><span className="font-medium">Escola:</span> {alert.school}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(alert.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="bg-white">Visualizar</Button>
                <Button size="sm" variant="outline" className="bg-white">Resolver</Button>
              </div>
            </div>
          ))
        )}
        
        {resolvedAlerts.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="mt-2">
              <h3 className="text-sm font-medium mb-3">Alertas Resolvidos Recentemente</h3>
              {resolvedAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between py-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{alert.message} - {alert.deviceName}</span>
                  </div>
                  <span className="text-xs">
                    {new Date(alert.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

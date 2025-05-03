
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeviceAlert } from '@/services/deviceAlertService';
import { formatDateBR } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface DeviceAlertsProps {
  deviceId?: string;
}

export const DeviceAlerts = ({ deviceId }: DeviceAlertsProps) => {
  const [alerts, setAlerts] = useState<DeviceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Simulação de chamada de API para buscar alertas
        let alertsData: DeviceAlert[] = [];
        
        if (deviceId) {
          // Se temos um ID de dispositivo, buscamos alertas específicos
          alertsData = await import('@/services/deviceAlertService').then(
            module => module.deviceAlertService.getAlertsByDeviceId(deviceId)
          );
        } else {
          // Caso contrário, buscamos os alertas não resolvidos
          alertsData = await import('@/services/deviceAlertService').then(
            module => module.deviceAlertService.getUnresolvedAlerts()
          );
        }
        
        setAlerts(alertsData);
      } catch (error) {
        console.error('Erro ao buscar alertas:', error);
        toast({
          title: "Erro ao buscar alertas",
          description: "Não foi possível carregar os alertas de dispositivos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, [deviceId, toast]);
  
  const handleResolveAlert = async (alertId: string) => {
    try {
      await import('@/services/deviceAlertService').then(
        module => module.deviceAlertService.resolveAlert(alertId, 'Usuário Atual')
      );
      
      // Atualiza a lista de alertas
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true, resolvedAt: new Date().toISOString(), resolvedBy: 'Usuário Atual' }
          : alert
      ));
      
      toast({
        title: "Alerta resolvido",
        description: "O alerta foi marcado como resolvido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao resolver alerta:', error);
      toast({
        title: "Erro ao resolver alerta",
        description: "Não foi possível marcar o alerta como resolvido",
        variant: "destructive"
      });
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high': 
        return <AlertCircle className="h-5 w-5" />;
      case 'medium':
      case 'low': 
        return <AlertTriangle className="h-5 w-5" />;
      default: 
        return <AlertCircle className="h-5 w-5" />;
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas</CardTitle>
          <CardDescription>Carregando alertas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas</CardTitle>
          <CardDescription>Ocorrências e notificações relacionadas a este dispositivo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum Alerta</h3>
            <p className="text-muted-foreground max-w-md">
              Este dispositivo não possui alertas ou ocorrências registradas até o momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
        <CardDescription>
          {deviceId 
            ? "Ocorrências e notificações relacionadas a este dispositivo"
            : "Alertas ativos em todo o sistema"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`rounded-md border p-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{alert.message}</h4>
                    <div className="text-xs mt-1 flex items-center gap-2">
                      <span className="font-medium">{alert.deviceName}</span>
                      {alert.schoolName && (
                        <>
                          <span>•</span>
                          <span>{alert.schoolName}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">
                        {formatDateBR(new Date(alert.timestamp))}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  {alert.resolved ? (
                    <div className="flex items-center text-xs gap-1 text-green-600">
                      <Check className="h-4 w-4" /> 
                      <span>Resolvido</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      Marcar como resolvido
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

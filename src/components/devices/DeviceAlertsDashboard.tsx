
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { DeviceAlert, AlertSeverity, deviceAlertService } from '@/services/deviceAlertService';
import { AlertCircle, Bell, Filter } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { formatDateBR } from '@/lib/utils';

export const DeviceAlertsDashboard = () => {
  const [alerts, setAlerts] = useState<DeviceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity[]>([
    AlertSeverity.CRITICAL, AlertSeverity.HIGH, AlertSeverity.MEDIUM, AlertSeverity.LOW
  ]);
  const [typeFilter, setTypeFilter] = useState<string[]>(['card', 'wristband', 'terminal']);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const allAlerts = await deviceAlertService.getUnresolvedAlerts();
        setAlerts(allAlerts);
      } catch (error) {
        console.error('Erro ao buscar alertas:', error);
        toast({
          title: "Erro ao carregar alertas",
          description: "Não foi possível obter os alertas de dispositivos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, [toast]);
  
  const handleResolveAlert = async (alertId: string) => {
    try {
      await deviceAlertService.resolveAlert(alertId, 'Usuário Atual');
      
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      
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
  
  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <Badge variant="destructive">Crítico</Badge>;
      case AlertSeverity.HIGH:
        return <Badge className="bg-red-500">Alto</Badge>;
      case AlertSeverity.MEDIUM:
        return <Badge className="bg-orange-500">Médio</Badge>;
      case AlertSeverity.LOW:
        return <Badge className="bg-yellow-500">Baixo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  const getDeviceTypeBadge = (type: string) => {
    switch (type) {
      case 'card':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Cartão</Badge>;
      case 'wristband':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Pulseira</Badge>;
      case 'terminal':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Terminal</Badge>;
      default:
        return <Badge variant="outline">Outro</Badge>;
    }
  };
  
  const filteredAlerts = alerts.filter(alert => 
    severityFilter.includes(alert.severity as AlertSeverity) && 
    typeFilter.includes(alert.deviceType)
  );
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard de Alertas</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard de Alertas</CardTitle>
          <CardDescription>Monitoramento de problemas com dispositivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
            <Bell className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum Alerta</h3>
            <p className="text-muted-foreground max-w-md">
              Não há alertas ativos no sistema neste momento. Todos os dispositivos estão funcionando normalmente.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Dashboard de Alertas</CardTitle>
          <CardDescription>Monitoramento de problemas com dispositivos</CardDescription>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Severidade</p>
                <DropdownMenuCheckboxItem
                  checked={severityFilter.includes(AlertSeverity.CRITICAL)}
                  onCheckedChange={(checked) => {
                    setSeverityFilter(checked 
                      ? [...severityFilter, AlertSeverity.CRITICAL]
                      : severityFilter.filter(s => s !== AlertSeverity.CRITICAL)
                    );
                  }}
                >
                  Crítico
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={severityFilter.includes(AlertSeverity.HIGH)}
                  onCheckedChange={(checked) => {
                    setSeverityFilter(checked 
                      ? [...severityFilter, AlertSeverity.HIGH]
                      : severityFilter.filter(s => s !== AlertSeverity.HIGH)
                    );
                  }}
                >
                  Alto
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={severityFilter.includes(AlertSeverity.MEDIUM)}
                  onCheckedChange={(checked) => {
                    setSeverityFilter(checked 
                      ? [...severityFilter, AlertSeverity.MEDIUM]
                      : severityFilter.filter(s => s !== AlertSeverity.MEDIUM)
                    );
                  }}
                >
                  Médio
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={severityFilter.includes(AlertSeverity.LOW)}
                  onCheckedChange={(checked) => {
                    setSeverityFilter(checked 
                      ? [...severityFilter, AlertSeverity.LOW]
                      : severityFilter.filter(s => s !== AlertSeverity.LOW)
                    );
                  }}
                >
                  Baixo
                </DropdownMenuCheckboxItem>
              </div>
              <div className="p-2 pt-0">
                <p className="text-xs font-medium text-muted-foreground mb-2">Tipo de Dispositivo</p>
                <DropdownMenuCheckboxItem
                  checked={typeFilter.includes('terminal')}
                  onCheckedChange={(checked) => {
                    setTypeFilter(checked 
                      ? [...typeFilter, 'terminal']
                      : typeFilter.filter(t => t !== 'terminal')
                    );
                  }}
                >
                  Terminais
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={typeFilter.includes('card')}
                  onCheckedChange={(checked) => {
                    setTypeFilter(checked 
                      ? [...typeFilter, 'card']
                      : typeFilter.filter(t => t !== 'card')
                    );
                  }}
                >
                  Cartões
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={typeFilter.includes('wristband')}
                  onCheckedChange={(checked) => {
                    setTypeFilter(checked 
                      ? [...typeFilter, 'wristband']
                      : typeFilter.filter(t => t !== 'wristband')
                    );
                  }}
                >
                  Pulseiras
                </DropdownMenuCheckboxItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {filteredAlerts.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Nenhum alerta encontrado com os filtros selecionados
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="bg-card rounded-md border p-4">
                <div className="flex justify-between">
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'critical' || alert.severity === 'high' 
                        ? 'text-red-500' 
                        : alert.severity === 'medium' 
                          ? 'text-orange-500' 
                          : 'text-yellow-500'
                    }`} />
                    <div>
                      <div className="flex gap-2 items-center">
                        {getSeverityBadge(alert.severity as AlertSeverity)}
                        {getDeviceTypeBadge(alert.deviceType)}
                      </div>
                      <h4 className="font-medium mt-1">{alert.message}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">{alert.deviceName}</span>
                        {alert.schoolName && (
                          <>
                            {" • "}
                            <span>{alert.schoolName}</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Reportado em {formatDateBR(new Date(alert.timestamp))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      Resolver
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabletIcon, Battery, WifiHigh, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export const TabletMonitoring = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dados mockados para tablets ativos
  const activeTablets = [
    { 
      id: 'TB001', 
      name: 'Tablet Recepção', 
      school: 'Escola São Paulo',
      batteryLevel: 78, 
      lastSeen: '3 min atrás',
      signalStrength: 85,
      location: 'Entrada Principal',
      status: 'online',
      checkIns: 24,
      checkOuts: 18
    },
    { 
      id: 'TB015', 
      name: 'Tablet Cantina', 
      school: 'Escola São Paulo',
      batteryLevel: 32, 
      lastSeen: '1 min atrás',
      signalStrength: 70,
      location: 'Cantina',
      status: 'online',
      checkIns: 45,
      checkOuts: 42
    },
    { 
      id: 'TB023', 
      name: 'Tablet Secretaria', 
      school: 'Escola Rio de Janeiro',
      batteryLevel: 91, 
      lastSeen: '5 min atrás',
      signalStrength: 92,
      location: 'Secretaria',
      status: 'online',
      checkIns: 12,
      checkOuts: 10
    },
  ];
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simula atualização dos dados
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          Monitoramento em Tempo Real
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          disabled={isRefreshing}
          onClick={handleRefresh}
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {activeTablets.map((tablet) => (
          <div key={tablet.id} className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${tablet.status === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <TabletIcon size={16} className={tablet.status === 'online' ? 'text-green-600' : 'text-red-600'} />
                </div>
                <div>
                  <h3 className="font-medium">{tablet.name}</h3>
                  <p className="text-sm text-muted-foreground">{tablet.school}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">ID: {tablet.id}</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Battery size={14} className={tablet.batteryLevel < 20 ? 'text-red-500' : tablet.batteryLevel < 50 ? 'text-amber-500' : 'text-green-500'} />
                  <span className="text-sm">Bateria</span>
                </div>
                <div className="mt-1">
                  <Progress value={tablet.batteryLevel} className="h-2" />
                  <p className="text-xs text-right mt-1">{tablet.batteryLevel}%</p>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <WifiHigh size={14} className="text-blue-500" />
                  <span className="text-sm">Sinal</span>
                </div>
                <div className="mt-1">
                  <Progress value={tablet.signalStrength} className="h-2" />
                  <p className="text-xs text-right mt-1">{tablet.signalStrength}%</p>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-500" />
                  <span className="text-sm">Localização</span>
                </div>
                <p className="text-xs mt-2">{tablet.location}</p>
              </div>
              
              <div className="flex flex-col">
                <div className="text-sm">Atividade Hoje</div>
                <div className="flex gap-4 mt-2">
                  <div className="text-xs">
                    <span className="font-medium text-green-600">{tablet.checkIns}</span> Check-ins
                  </div>
                  <div className="text-xs">
                    <span className="font-medium text-amber-600">{tablet.checkOuts}</span> Check-outs
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-1">
              Última atividade: {tablet.lastSeen}
            </div>
            
            <Separator className="mt-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

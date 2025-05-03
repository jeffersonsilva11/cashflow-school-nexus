
import React from 'react';
import { 
  Tablet, 
  WifiHigh, 
  WifiOff, 
  BatteryLow, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TabletStatsProps {
  stats: {
    total: number;
    online: number;
    offline: number;
    batteryLow: number;
    alerts: number;
    pendingActivation: number;
  };
}

export const TabletDeviceStats = ({ stats }: TabletStatsProps) => {
  const statCards = [
    {
      title: 'Total de Tablets',
      value: stats.total,
      icon: <Tablet className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-700'
    },
    {
      title: 'Online',
      value: stats.online,
      icon: <WifiHigh className="h-5 w-5 text-green-500" />,
      color: 'bg-green-50 border-green-100',
      textColor: 'text-green-700'
    },
    {
      title: 'Offline',
      value: stats.offline,
      icon: <WifiOff className="h-5 w-5 text-red-500" />,
      color: 'bg-red-50 border-red-100',
      textColor: 'text-red-700'
    },
    {
      title: 'Bateria Baixa',
      value: stats.batteryLow,
      icon: <BatteryLow className="h-5 w-5 text-amber-500" />,
      color: 'bg-amber-50 border-amber-100',
      textColor: 'text-amber-700'
    },
    {
      title: 'Alertas',
      value: stats.alerts,
      icon: <AlertCircle className="h-5 w-5 text-purple-500" />,
      color: 'bg-purple-50 border-purple-100',
      textColor: 'text-purple-700'
    },
    {
      title: 'Aguardando Ativação',
      value: stats.pendingActivation,
      icon: <Clock className="h-5 w-5 text-gray-500" />,
      color: 'bg-gray-50 border-gray-100',
      textColor: 'text-gray-700'
    }
  ];

  return (
    <>
      {statCards.map((card, index) => (
        <Card key={index} className={`${card.color} border`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
              <div className="p-2 rounded-full bg-white shadow-sm">
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

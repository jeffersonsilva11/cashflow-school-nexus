
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  description: string;
  value: number | string;
  footer: React.ReactNode;
  icon?: React.ReactNode;
}

const StatsCard = ({ title, description, value, footer, icon }: StatsCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      {icon ? (
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold">{value}</p>
          {icon}
        </div>
      ) : (
        <p className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      )}
    </CardContent>
    <CardFooter>
      <p className="text-sm text-muted-foreground">
        {footer}
      </p>
    </CardFooter>
  </Card>
);

interface CardDeviceStatsProps {
  cardStats: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    transit: number;
  };
}

export const CardDeviceStats = ({ cardStats }: CardDeviceStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatsCard 
      title="Total de Dispositivos" 
      description="Cartões e pulseiras emitidos" 
      value={cardStats.total} 
      footer={`${((cardStats.active / cardStats.total) * 100).toFixed(1)}% ativos`}
    />
    <StatsCard 
      title="Dispositivos Ativos" 
      description="Vinculados a estudantes" 
      value={cardStats.active} 
      footer={`${cardStats.inactive} inativos, ${cardStats.pending} pendentes`}
    />
    <StatsCard 
      title="Em Trânsito" 
      description="Em processo de entrega" 
      value={cardStats.transit} 
      footer="5 escolas aguardando entrega"
    />
  </div>
);

interface TerminalDeviceStatsProps {
  terminalStats: {
    total: number;
    online: number;
    offline: number;
  };
}

export const TerminalDeviceStats = ({ terminalStats }: TerminalDeviceStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatsCard 
      title="Total de Maquininhas" 
      description="Dispositivos instalados" 
      value={terminalStats.total} 
      footer="Em 23 escolas"
    />
    <StatsCard 
      title="Dispositivos Online" 
      description="Conectados ao sistema" 
      value={terminalStats.online} 
      icon={<span className="rounded-full bg-green-500 h-3 w-3 animate-pulse"></span>}
      footer={`${((terminalStats.online / terminalStats.total) * 100).toFixed(1)}% de disponibilidade`}
    />
    <StatsCard 
      title="Dispositivos Offline" 
      description="Desconectados do sistema" 
      value={terminalStats.offline} 
      icon={<span className="rounded-full bg-red-500 h-3 w-3"></span>}
      footer={`${((terminalStats.offline / terminalStats.total) * 100).toFixed(1)}% requerendo atenção`}
    />
  </div>
);

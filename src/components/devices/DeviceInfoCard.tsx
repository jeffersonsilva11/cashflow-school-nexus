
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { CheckCircle } from 'lucide-react';

interface DeviceInfoCardProps {
  deviceData: {
    status: string;
    serial: string;
    uid: string;
    type: string;
    batch: string;
    activationDate: string;
    settings: {
      enabledFeatures: string[];
    };
  };
}

export const DeviceInfoCard = ({ deviceData }: DeviceInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Dispositivo</CardTitle>
        <CardDescription>Detalhes técnicos e identificação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <StatusBadge status={deviceData.status} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Número de Série</span>
              <span className="text-sm font-medium">{deviceData.serial}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">UID NFC</span>
              <span className="text-sm font-medium">{deviceData.uid}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tipo</span>
              <span className="text-sm font-medium">{deviceData.type}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Lote</span>
              <span className="text-sm font-medium">{deviceData.batch}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data de Ativação</span>
              <span className="text-sm font-medium">
                {new Date(deviceData.activationDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-2">Recursos Habilitados</h4>
            <div className="flex flex-wrap gap-2">
              {deviceData.settings.enabledFeatures.includes('payments') && (
                <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckCircle size={12} className="mr-1" /> Pagamentos
                </div>
              )}
              {deviceData.settings.enabledFeatures.includes('access') && (
                <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckCircle size={12} className="mr-1" /> Controle de Acesso
                </div>
              )}
              {deviceData.settings.enabledFeatures.includes('identification') && (
                <div className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckCircle size={12} className="mr-1" /> Identificação
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

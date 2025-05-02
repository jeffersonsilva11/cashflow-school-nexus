
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const DeviceAlerts = () => {
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
};

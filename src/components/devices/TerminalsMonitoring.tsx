
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wifi } from 'lucide-react';

export const TerminalsMonitoring = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Monitoramento de Maquininhas</h3>
            <p className="text-sm text-muted-foreground">Acompanhe o status dos terminais em tempo real</p>
          </div>
          <Button className="gap-1">
            <Plus size={16} />
            Novo Terminal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
          <Wifi className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
          <p className="text-muted-foreground max-w-md">
            O módulo completo de monitoramento de terminais está sendo implementado. 
            Em breve você poderá acompanhar o status de todas as maquininhas do sistema por aqui.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

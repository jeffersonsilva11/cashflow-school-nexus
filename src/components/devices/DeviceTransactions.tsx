
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export const DeviceTransactions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações</CardTitle>
        <CardDescription>Histórico de pagamentos realizados com este dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Módulo de Transações</h3>
          <p className="text-muted-foreground max-w-md">
            O histórico detalhado de transações será integrado em breve.
            Você poderá visualizar todos os pagamentos realizados com este dispositivo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

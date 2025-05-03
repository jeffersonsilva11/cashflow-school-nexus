
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, BatteryMedium, Wifi, WifiOff } from "lucide-react";
import { PaymentTerminal } from '@/services/paymentGatewayService';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface PaymentTerminalsProps {
  terminals: PaymentTerminal[];
  isLoading: boolean;
}

export const PaymentTerminals = ({ terminals, isLoading }: PaymentTerminalsProps) => {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 bg-muted/50 rounded"></CardTitle>
          <CardDescription className="h-4 bg-muted/30 rounded mt-2 w-3/4"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Nunca';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'dd/MM/yyyy HH:mm', { locale: pt });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Manutenção</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getGatewayBadge = (gateway: string) => {
    switch (gateway) {
      case 'stone':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Stone</Badge>;
      case 'mercadopago':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200">Mercado Pago</Badge>;
      case 'pagseguro':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">PagSeguro</Badge>;
      default:
        return <Badge variant="outline">Outro</Badge>;
    }
  };

  const handleSyncTerminal = (terminalId: string) => {
    console.log(`Synchronizing terminal ${terminalId}`);
    // This would trigger a sync with the terminal in a real implementation
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Terminais de Pagamento</CardTitle>
        <CardDescription>Maquininhas e dispositivos conectados à cantina</CardDescription>
      </CardHeader>
      <CardContent>
        {terminals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Nenhum terminal registrado para esta cantina.</p>
            <Button variant="outline">Registrar Nova Maquininha</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Sincronização</TableHead>
                  <TableHead>Conexão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terminals.map((terminal) => (
                  <TableRow key={terminal.id}>
                    <TableCell className="font-medium">{terminal.terminal_id}</TableCell>
                    <TableCell>{terminal.model}</TableCell>
                    <TableCell>{getGatewayBadge(terminal.gateway)}</TableCell>
                    <TableCell>{getStatusBadge(terminal.status)}</TableCell>
                    <TableCell>{formatDate(terminal.last_sync_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {terminal.connection_status === 'online' ? (
                          <>
                            <Wifi className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">Online</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">Offline</span>
                          </>
                        )}
                        {terminal.battery_level !== undefined && (
                          <div className="ml-2 flex items-center">
                            <BatteryMedium className="h-4 w-4 mr-1" />
                            <span className="text-xs">{terminal.battery_level}%</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => handleSyncTerminal(terminal.terminal_id)}
                      >
                        <ArrowDownUp className="h-3 w-3 mr-1" />
                        Sincronizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

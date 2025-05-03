
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VendorTransfer } from '@/services/vendorService';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface TransferHistoryProps {
  transfers: VendorTransfer[];
  isLoading: boolean;
}

export const TransferHistory = ({ transfers, isLoading }: TransferHistoryProps) => {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', 
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: pt });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Concluído</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Histórico de Repasses</CardTitle>
        <CardDescription>Histórico de repasses financeiros para a cantina</CardDescription>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <p className="text-muted-foreground">Nenhum repasse encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{formatDate(transfer.transfer_date)}</TableCell>
                    <TableCell>{formatCurrency(transfer.amount)}</TableCell>
                    <TableCell>{transfer.payment_method || '-'}</TableCell>
                    <TableCell>
                      {transfer.reference_period_start && transfer.reference_period_end ? 
                        `${formatDate(transfer.reference_period_start)} - ${formatDate(transfer.reference_period_end)}` : 
                        '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
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

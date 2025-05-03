
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface Transaction {
  id: string;
  date: Date;
  student: string;
  amount: number;
  type: string;
  vendor?: string;
  location?: string;
}

interface DeviceTransactionsProps {
  deviceId?: string;
  transactions?: Transaction[];
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(date);
};

export const DeviceTransactions = ({ deviceId, transactions = [] }: DeviceTransactionsProps) => {
  const hasTransactions = transactions.length > 0;

  // Dados de exemplo se não houver transações reais
  const mockTransactions: Transaction[] = [
    {
      id: 'TX12345',
      date: new Date(2025, 4, 2, 10, 15),
      student: 'Ana Silva',
      amount: 12.50,
      type: 'purchase',
      vendor: 'Cantina Central',
      location: 'Bloco A'
    },
    {
      id: 'TX12346',
      date: new Date(2025, 4, 2, 9, 30),
      student: 'Pedro Santos',
      amount: 8.75,
      type: 'purchase',
      vendor: 'Lanchonete do João (Terceirizada)',
      location: 'Bloco B'
    },
    {
      id: 'TX12347',
      date: new Date(2025, 4, 1, 14, 45),
      student: 'Maria Oliveira',
      amount: 15.00,
      type: 'purchase',
      vendor: 'Cantina Central',
      location: 'Bloco A'
    }
  ];

  // Use transações reais ou mockadas
  const displayTransactions = hasTransactions ? transactions : mockTransactions;

  if (!hasTransactions && !deviceId) {
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações do Dispositivo</CardTitle>
        <CardDescription>
          {deviceId 
            ? `Histórico de pagamentos realizados com o dispositivo ${deviceId}` 
            : 'Histórico de pagamentos recentes'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Estabelecimento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
                <TableCell className="font-medium">{transaction.student}</TableCell>
                <TableCell>
                  <div>
                    <p>{transaction.vendor || "Cantina da Escola"}</p>
                    <p className="text-xs text-muted-foreground">{transaction.location || "-"}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {transaction.type === 'purchase' ? 'Compra' : 'Recarga'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

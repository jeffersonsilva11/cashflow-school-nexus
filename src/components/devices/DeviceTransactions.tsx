import React, { useEffect, useState } from 'react';
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
import { Transaction, fetchDeviceTransactions, useDeviceTransactions } from '@/services/transactionService';

interface DeviceTransactionsProps {
  deviceId?: string;
  transactions?: Transaction[];
}

const formatDate = (date: Date | string) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(dateObj);
};

export const DeviceTransactions = ({ deviceId, transactions: initialTransactions }: DeviceTransactionsProps) => {
  const { data: fetchedTransactions, isLoading, error } = useDeviceTransactions(deviceId);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    // If initial transactions are provided, use them
    if (initialTransactions && initialTransactions.length > 0) {
      setTransactions(initialTransactions);
      return;
    }
    
    // Otherwise use the fetched transactions
    if (fetchedTransactions) {
      setTransactions(fetchedTransactions);
    }
  }, [initialTransactions, fetchedTransactions]);
  
  const hasTransactions = transactions.length > 0;

  // Dados de exemplo se não houver transações reais
  const mockTransactions: Transaction[] = [
    {
      id: 'TX12345',
      transaction_id: 'TX12345',
      transaction_date: new Date(2025, 4, 2, 10, 15),
      student: { name: 'Ana Silva' },
      amount: 12.50,
      type: 'purchase',
      status: 'completed',
      vendor: { name: 'Cantina Central', type: 'own' },
      notes: 'Bloco A'
    },
    {
      id: 'TX12346',
      transaction_id: 'TX12346',
      transaction_date: new Date(2025, 4, 2, 9, 30),
      student: { name: 'Pedro Santos' },
      amount: 8.75,
      type: 'purchase',
      status: 'completed',
      vendor: { name: 'Lanchonete do João', type: 'third_party' },
      notes: 'Bloco B'
    },
    {
      id: 'TX12347',
      transaction_id: 'TX12347',
      transaction_date: new Date(2025, 4, 1, 14, 45),
      student: { name: 'Maria Oliveira' },
      amount: 15.00,
      type: 'purchase',
      status: 'completed',
      vendor: { name: 'Cantina Central', type: 'own' },
      notes: 'Bloco A'
    }
  ];

  // Use transações reais ou mockadas
  const displayTransactions = isLoading ? [] : (hasTransactions ? transactions : mockTransactions);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>Carregando transações...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>Ocorreu um erro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
            <CreditCard className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Erro ao carregar transações</h3>
            <p className="text-muted-foreground max-w-md">
              {error instanceof Error ? error.message : "Erro ao carregar as transações. Tente novamente mais tarde."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <TableCell className="text-sm">{formatDate(transaction.transaction_date)}</TableCell>
                <TableCell className="font-medium">{transaction.student?.name || "-"}</TableCell>
                <TableCell>
                  <div>
                    <p>{transaction.vendor?.name || "Cantina da Escola"}</p>
                    <p className="text-xs text-muted-foreground">{transaction.notes || "-"}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {transaction.type === 'purchase' ? 'Compra' : transaction.type === 'topup' ? 'Recarga' : 'Estorno'}
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

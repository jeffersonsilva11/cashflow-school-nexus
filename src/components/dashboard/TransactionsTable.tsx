
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import { Transaction } from '@/services/transactionService';
import { Skeleton } from '@/components/ui/skeleton';

export interface TransactionsTableProps {
  transactions: Transaction[];
  title: string;
  description: string;
  type?: string;
  isLoading?: boolean;
}

// Format date to display only the day and month
const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'N/A';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(date);
};

export const TransactionsTable = ({ transactions, title, description, type, isLoading = false }: TransactionsTableProps) => {
  // If type is specified, filter transactions
  const displayTransactions = type 
    ? transactions.filter(t => t.type === type || t.status === type) 
    : transactions;

  if (isLoading) {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell>
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Aluno</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTransactions && displayTransactions.length > 0 ? (
            displayTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-sm">{formatDate(transaction.transaction_date)}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{transaction.student?.name || 'Desconhecido'}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.student?.school?.name || transaction.school?.name || 'Escola não especificada'}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === 'purchase' ? 'secondary' : 'default'}>
                    {transaction.type === 'purchase' ? 'Compra' : 
                     transaction.type === 'topup' ? 'Recarga' : 'Reembolso'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                Nenhuma transação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

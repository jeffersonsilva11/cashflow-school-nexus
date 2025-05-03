
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

interface Transaction {
  id: string;
  date: Date;
  student: string;
  school: string;
  type: string;
  amount: number;
  status: string;
}

export interface TransactionsTableProps {
  transactions: Transaction[];
  title: string;
  description: string;
  type?: string;
}

// Format date to display only the day and month
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(date);
};

export const TransactionsTable = ({ transactions, title, description, type }: TransactionsTableProps) => {
  // If type is specified, filter transactions
  const displayTransactions = type 
    ? transactions.filter(t => t.type === type || t.status === type) 
    : transactions;

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
          {displayTransactions.length > 0 ? (
            displayTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{transaction.student}</p>
                    <p className="text-sm text-muted-foreground">{transaction.school}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === 'purchase' ? 'secondary' : 'default'}>
                    {transaction.type === 'purchase' ? 'Compra' : 'Recarga'}
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

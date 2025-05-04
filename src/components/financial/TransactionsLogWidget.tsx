
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchRecentTransactions } from '@/services/transactionService'; 
import { Transaction } from '@/services/transactionService';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, RefreshCcw } from 'lucide-react';

interface TransactionsLogWidgetProps {
  limit?: number;
}

export default function TransactionsLogWidget({ limit = 5 }: TransactionsLogWidgetProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const data = await fetchRecentTransactions(limit);
        setTransactions(data);
      } catch (error) {
        console.error("Erro ao carregar transações recentes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, [limit]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Concluída</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Falha</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Estornada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowDownCircle className="h-4 w-4 text-red-500" />;
      case 'topup':
        return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
      case 'refund':
        return <RefreshCcw className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string | Date) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
    
    if (type === 'purchase') {
      return `-${formattedAmount}`;
    } else {
      return formattedAmount;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase': return 'Compra';
      case 'topup': return 'Recarga';
      case 'refund': return 'Estorno';
      default: return type;
    }
  };
  
  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
              <div className="flex gap-3">
                <div className="mt-1">
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <div className="font-medium">
                    {getTypeLabel(transaction.type)} - {transaction.student?.name || 'Aluno não identificado'}
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-2 gap-y-1 mt-1">
                    <span>{formatDate(transaction.transaction_date)}</span>
                    <span>•</span>
                    {transaction.vendor && (
                      <span>Vendedor: {transaction.vendor.name}</span>
                    )}
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>
              <div className={`font-medium ${transaction.type === 'purchase' ? 'text-red-600' : 'text-green-600'}`}>
                {formatAmount(transaction.amount, transaction.type)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          Nenhuma transação recente encontrada.
        </div>
      )}
    </div>
  );
}

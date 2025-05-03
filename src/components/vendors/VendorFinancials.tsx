
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorFinancials as FinancialsType } from '@/services/vendorService';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface VendorFinancialsProps {
  financials: FinancialsType | null;
  isLoading: boolean;
}

export const VendorFinancials = ({ financials, isLoading }: VendorFinancialsProps) => {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 bg-muted/50 rounded"></CardTitle>
          <CardDescription className="h-4 bg-muted/30 rounded mt-2 w-3/4"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-muted/30 rounded"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!financials) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informações Financeiras</CardTitle>
          <CardDescription>Informações financeiras não encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Não foram encontradas informações financeiras para esta cantina.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definido';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: pt });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', 
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resumo Financeiro</CardTitle>
        <CardDescription>Detalhes financeiros da cantina</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">Saldo Atual</p>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">{formatCurrency(financials.balance)}</p>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Pendente para Transferência</p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{formatCurrency(financials.pending_transfer)}</p>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">Frequência de Repasses</p>
            <p className="text-2xl font-bold">{financials.transfer_frequency || 'Mensal'}</p>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Último repasse</p>
              <p className="font-medium">{formatDate(financials.last_transfer_date)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Próximo repasse</p>
              <p className="font-medium">{formatDate(financials.next_transfer_date)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Método de pagamento</p>
              <p className="font-medium">{financials.payment_method || 'Não configurado'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

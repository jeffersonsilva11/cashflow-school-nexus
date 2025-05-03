
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CommissionTier } from '@/services/vendorService';

interface CommissionTiersProps {
  tiers: CommissionTier[];
  isLoading: boolean;
}

export const CommissionTiers = ({ tiers, isLoading }: CommissionTiersProps) => {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 bg-muted/50 rounded"></CardTitle>
          <CardDescription className="h-4 bg-muted/30 rounded mt-2 w-3/4"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-36 bg-muted/30 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', 
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Estrutura de Comissões</CardTitle>
        <CardDescription>Taxas de comissão por faixa de vendas</CardDescription>
      </CardHeader>
      <CardContent>
        {tiers.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma estrutura de comissão definida.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendas Mínimas</TableHead>
                <TableHead>Vendas Máximas</TableHead>
                <TableHead>Taxa de Comissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((tier) => (
                <TableRow key={tier.id}>
                  <TableCell>{formatCurrency(tier.min_sales_amount)}</TableCell>
                  <TableCell>{tier.max_sales_amount ? formatCurrency(tier.max_sales_amount) : 'Sem limite'}</TableCell>
                  <TableCell>{formatPercentage(tier.commission_rate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

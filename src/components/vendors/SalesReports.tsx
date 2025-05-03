
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SalesReport } from '@/services/vendorService';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

interface SalesReportsProps {
  reports: SalesReport[];
  isLoading: boolean;
}

export const SalesReports = ({ reports, isLoading }: SalesReportsProps) => {
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

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: pt });
  };

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'generated':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Gerado</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Processando</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Erro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Relatórios de Vendas</CardTitle>
        <CardDescription>Histórico de relatórios de vendas</CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <p className="text-muted-foreground">Nenhum relatório de vendas disponível.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Total Vendas</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Valor Líquido</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.reporting_period}</TableCell>
                    <TableCell>{formatDate(report.start_date)}</TableCell>
                    <TableCell>{formatDate(report.end_date)}</TableCell>
                    <TableCell>{formatCurrency(report.total_sales)}</TableCell>
                    <TableCell>{formatCurrency(report.commission_amount)}</TableCell>
                    <TableCell>{formatCurrency(report.net_amount)}</TableCell>
                    <TableCell>{getStatusBadge(report.report_status)}</TableCell>
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

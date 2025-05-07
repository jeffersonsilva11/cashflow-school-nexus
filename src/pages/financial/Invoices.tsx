
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, FilterIcon, Download, PlusCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useInvoices } from '@/services/invoices/hooks';
import { useToast } from '@/components/ui/use-toast';

export default function Invoices() {
  const { data: invoices, isLoading, error } = useInvoices();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar faturas",
        description: "Não foi possível carregar as faturas. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'processing':
      case 'pending':
        return 'warning';
      case 'canceled':
      case 'overdue':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'processing':
        return 'Processando';
      case 'pending':
        return 'Pendente';
      case 'canceled':
        return 'Cancelado';
      case 'overdue':
        return 'Vencida';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'PIX':
      case 'pix':
        return 'PIX';
      case 'Credit Card':
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'Bank Transfer':
      case 'bank_transfer':
        return 'Transferência';
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold">Faturas</h1>
          <p className="text-muted-foreground">
            Carregando faturas...
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Faturas</h1>
        <p className="text-muted-foreground">
          Histórico de faturas emitidas e pagamentos
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Faturas</CardTitle>
              <CardDescription>
                Histórico de faturas emitidas
              </CardDescription>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button size="sm" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nova Fatura
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar faturas..."
                className="pl-8 w-full"
              />
            </div>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FilterIcon className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invoices && invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº da Fatura</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
                    <TableCell>{(invoice.schools as any)?.name || 'Escola não especificada'}</TableCell>
                    <TableCell>
                      {invoice.issued_date ? format(new Date(invoice.issued_date), 'P', {locale: ptBR}) : ''}
                    </TableCell>
                    <TableCell>{invoice.payment_method ? getPaymentMethodLabel(invoice.payment_method) : '-'}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">Nenhuma fatura encontrada</p>
              <Button variant="outline" size="sm" className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar nova fatura
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

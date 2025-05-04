
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

// Dados mockados para demonstração
const invoicesData = [
  {
    id: 'INV-2023-001',
    school: 'Escola Estadual São Paulo',
    amount: 1250.50,
    status: 'paid',
    date: new Date(2025, 4, 15),
    paymentMethod: 'PIX'
  },
  {
    id: 'INV-2023-002',
    school: 'Colégio Parthenon',
    amount: 3450.75,
    status: 'paid',
    date: new Date(2025, 4, 10),
    paymentMethod: 'Credit Card'
  },
  {
    id: 'INV-2023-003',
    school: 'Escola Municipal Rio de Janeiro',
    amount: 950.25,
    status: 'canceled',
    date: new Date(2025, 3, 30),
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'INV-2023-004',
    school: 'Instituto Educacional Nova Era',
    amount: 2150.00,
    status: 'paid',
    date: new Date(2025, 4, 20),
    paymentMethod: 'PIX'
  },
  {
    id: 'INV-2023-005',
    school: 'Colégio Integrado',
    amount: 1850.35,
    status: 'processing',
    date: new Date(2025, 4, 5),
    paymentMethod: 'Credit Card'
  }
];

export default function Invoices() {
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
        return 'warning';
      case 'canceled':
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
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'PIX':
        return 'PIX';
      case 'Credit Card':
        return 'Cartão de Crédito';
      case 'Bank Transfer':
        return 'Transferência';
      default:
        return method;
    }
  };

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
              {invoicesData.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.school}</TableCell>
                  <TableCell>
                    {format(invoice.date, 'P', {locale: ptBR})}
                  </TableCell>
                  <TableCell>{getPaymentMethodLabel(invoice.paymentMethod)}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}

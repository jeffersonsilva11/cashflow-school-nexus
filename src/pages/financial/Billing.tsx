
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
import { SearchIcon, FilterIcon, Download, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados mockados para demonstração
const billingData = [
  {
    id: 'BILL-001',
    school: 'Escola Estadual São Paulo',
    amount: 1250.50,
    status: 'pending',
    dueDate: new Date(2025, 5, 15),
    type: 'subscription'
  },
  {
    id: 'BILL-002',
    school: 'Colégio Parthenon',
    amount: 3450.75,
    status: 'paid',
    dueDate: new Date(2025, 5, 10),
    type: 'subscription'
  },
  {
    id: 'BILL-003',
    school: 'Escola Municipal Rio de Janeiro',
    amount: 950.25,
    status: 'overdue',
    dueDate: new Date(2025, 4, 30),
    type: 'subscription'
  },
  {
    id: 'BILL-004',
    school: 'Instituto Educacional Nova Era',
    amount: 2150.00,
    status: 'pending',
    dueDate: new Date(2025, 5, 20),
    type: 'maintenance'
  },
  {
    id: 'BILL-005',
    school: 'Colégio Integrado',
    amount: 1850.35,
    status: 'paid',
    dueDate: new Date(2025, 5, 5),
    type: 'subscription'
  }
];

export default function Billing() {
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
      case 'pending':
        return 'outline';
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
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Atrasado';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Cobranças</h1>
        <p className="text-muted-foreground">
          Gerencie cobranças e faturas das escolas
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle>Cobranças</CardTitle>
              <CardDescription>
                Controle de cobranças e pagamentos para escolas
              </CardDescription>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button size="sm" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Nova Cobrança
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar cobranças..."
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
                <TableHead>ID</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.school}</TableCell>
                  <TableCell>
                    {item.type === 'subscription' ? 'Assinatura' : 'Manutenção'}
                  </TableCell>
                  <TableCell>
                    {format(item.dueDate, 'P', {locale: ptBR})}
                  </TableCell>
                  <TableCell>{formatCurrency(item.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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

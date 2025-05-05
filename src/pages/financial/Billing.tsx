
import React, { useState } from 'react';
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
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useInvoices } from "@/services/billingService";
import { toast } from "@/components/ui/use-toast";

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: invoices = [], isLoading, isError } = useInvoices();
  
  // Filtrar faturas pelo termo de busca
  const filteredInvoices = invoices.filter(invoice => 
    invoice.school?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
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
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleDownload = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados da fatura estão sendo exportados. Você receberá o download em breve."
    });
  };

  const handleNewBilling = () => {
    toast({
      title: "Nova cobrança",
      description: "Funcionalidade em desenvolvimento. Em breve estará disponível."
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold">Cobranças</h1>
          <p className="text-muted-foreground">
            Gerencie cobranças e faturas das escolas
          </p>
        </div>
        
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground">Carregando faturas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold">Cobranças</h1>
          <p className="text-muted-foreground">
            Gerencie cobranças e faturas das escolas
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-medium text-red-600 mb-2">Erro ao carregar dados</h2>
              <p className="text-muted-foreground">
                Ocorreu um erro ao tentar carregar as faturas. Por favor, tente novamente mais tarde.
              </p>
              <Button variant="outline" className="mt-4">
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button size="sm" className="flex items-center gap-2" onClick={handleNewBilling}>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
                    <TableCell>{invoice.school?.name || 'Escola não encontrada'}</TableCell>
                    <TableCell>
                      {formatDate(invoice.due_date)}
                    </TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

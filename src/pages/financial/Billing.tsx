import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ReceiptText, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  RefreshCcw,
  Send,
  ArrowDownUp,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { invoices, schoolFinancials } from '@/services/financialMockData';

export default function Billing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  // Combinar faturas e dados financeiros das escolas para criar um histórico de cobranças
  const billingHistory = invoices.map(invoice => {
    const school = schoolFinancials.find(s => s.id === invoice.schoolId) || {
      plan: 'Desconhecido',
      status: 'unknown'
    };
    
    return {
      ...invoice,
      plan: school.plan,
      schoolStatus: school.status
    };
  });
  
  // Aplicar filtros
  const filteredBilling = billingHistory.filter(bill => {
    const matchesSearch = 
      bill.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      bill.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
  
  // Aplicar ordenação
  const sortedBilling = [...filteredBilling].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime();
    } else if (sortBy === 'amount') {
      return b.amount - a.amount;
    } else if (sortBy === 'school') {
      return a.schoolName.localeCompare(b.schoolName);
    }
    return 0;
  });
  
  // Estatísticas
  const totalAmount = billingHistory.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = billingHistory.filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = billingHistory.filter(bill => bill.status === 'pending' || bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const handleViewBilling = (billingId: string) => {
    navigate(`/financial/billing/${billingId}`);
  };
  
  const handleSendReminder = (billingId: string) => {
    toast({
      title: "Lembrete enviado",
      description: `Um lembrete de pagamento foi enviado para a cobrança ${billingId}.`,
    });
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Relatório em geração",
      description: "O relatório de cobranças está sendo gerado e será baixado em breve.",
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Em atraso</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cobranças</h1>
          <p className="text-muted-foreground">
            Gestão e acompanhamento de cobranças financeiras
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateReport}>
            <Printer className="mr-2 h-4 w-4" />
            Relatório
          </Button>
          <Button onClick={() => navigate('/financial/invoices/create')}>
            <ReceiptText className="mr-2 h-4 w-4" />
            Nova Cobrança
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Faturado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Recebido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendente de Recebimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(pendingAmount)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Billing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cobranças</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por escola ou número da cobrança..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="overdue">Em atraso</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="amount">Valor</SelectItem>
                  <SelectItem value="school">Escola</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Cobrança 
                    <Button variant="ghost" size="icon" onClick={() => setSortBy(sortBy === 'date' ? 'date' : 'date')}>
                      <ArrowDownUp className="h-3 w-3" />
                    </Button>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Escola
                    <Button variant="ghost" size="icon" onClick={() => setSortBy(sortBy === 'school' ? 'school' : 'school')}>
                      <ArrowDownUp className="h-3 w-3" />
                    </Button>
                  </div>
                </TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Valor
                    <Button variant="ghost" size="icon" onClick={() => setSortBy(sortBy === 'amount' ? 'amount' : 'amount')}>
                      <ArrowDownUp className="h-3 w-3" />
                    </Button>
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBilling.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.schoolName}</TableCell>
                  <TableCell>{bill.plan}</TableCell>
                  <TableCell>{new Date(bill.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{formatCurrency(bill.amount)}</TableCell>
                  <TableCell>{getStatusBadge(bill.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewBilling(bill.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        {(bill.status === 'pending' || bill.status === 'overdue') && (
                          <DropdownMenuItem onClick={() => handleSendReminder(bill.id)}>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Lembrete
                          </DropdownMenuItem>
                        )}
                        {bill.status === 'overdue' && (
                          <DropdownMenuItem onClick={() => handleViewBilling(bill.id)}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Renegociar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

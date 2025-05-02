
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  School, 
  ArrowUpRight,
  Search,
  Filter,
  FileText,
  ArrowDown,
  ArrowUp,
  MoreHorizontal
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { schoolFinancials, financialReports } from '@/services/financialMockData';
import { FinancialOverviewChart } from '@/components/financial/FinancialOverviewChart';
import { RevenueByPlanChart } from '@/components/financial/RevenueByPlanChart';
import { FinancialTrendChart } from '@/components/financial/FinancialTrendChart';

export default function Financial() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('month');

  // Filtrar escolas pelo termo de busca
  const filteredSchools = schoolFinancials.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.id.toString().includes(searchTerm)
  );

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleGenerateInvoice = () => {
    navigate('/financial/invoices/create');
  };

  const handleViewSchoolFinancial = (schoolId: string) => {
    toast({
      title: "Visualizar financeiro da escola",
      description: `Abrindo informações financeiras detalhadas da escola ID: ${schoolId}`,
    });
    // Navegar para página financeira detalhada da escola (a ser implementada)
  };

  const handleViewInvoices = () => {
    navigate('/financial/invoices');
  };

  const handleViewSubscriptions = () => {
    navigate('/financial/subscriptions');
  };

  const handleViewBilling = () => {
    navigate('/financial/billing');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão Financeira</h1>
          <p className="text-muted-foreground">
            Visão geral financeira do sistema (apenas super admin)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewInvoices}>
            <FileText className="mr-2 h-4 w-4" />
            Faturas
          </Button>
          <Button onClick={handleGenerateInvoice}>
            <DollarSign className="mr-2 h-4 w-4" />
            Gerar Cobrança
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total ({periodFilter === 'month' ? 'Mês' : 'Ano'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialReports.overview.totalRevenueMonth)}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>{financialReports.overview.growthRate}% em relação ao período anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Escolas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialReports.overview.totalActiveSchools}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {financialReports.overview.totalActiveSubscriptions} assinaturas ativas
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média por Escola
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialReports.overview.averageRevenuePerSchool)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Receita média mensal por escola
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialReports.overview.totalPendingPayments)}
            </div>
            <div className="text-xs text-red-500 mt-1">
              Cobranças a receber
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral Financeira</CardTitle>
            <CardDescription>Evolução de receitas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialTrendChart data={financialReports.monthlyTrend} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribuição por Plano</CardTitle>
            <CardDescription>Receita por tipo de plano</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueByPlanChart data={financialReports.revenueByPlan} />
            <div className="mt-4 space-y-3">
              {financialReports.revenueByPlan.map((item) => (
                <div key={item.plan} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{item.plan}</span>
                  </div>
                  <div className="font-medium">{formatCurrency(item.revenue)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" onClick={handleViewInvoices}>
          Gerenciar Faturas
        </Button>
        <Button variant="outline" onClick={handleViewSubscriptions}>
          Gerenciar Assinaturas
        </Button>
        <Button variant="outline" onClick={handleViewBilling}>
          Gerenciar Cobranças
        </Button>
      </div>

      {/* Schools Financial Table */}
      <Card>
        <CardHeader>
          <CardTitle>Financeiro por Escola</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar escola por nome ou ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Escola</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Mensalidade</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Dispositivos</TableHead>
                <TableHead>Último Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.plan}</TableCell>
                  <TableCell>{formatCurrency(school.monthlyFee)}</TableCell>
                  <TableCell>{school.activeStudents}</TableCell>
                  <TableCell>{school.activeDevices}</TableCell>
                  <TableCell>{new Date(school.lastPayment).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        school.status === 'active' ? 'default' : 
                        school.status === 'pending' ? 'outline' : 
                        'destructive'
                      }
                    >
                      {school.status === 'active' ? 'Ativo' : 
                       school.status === 'pending' ? 'Pendente' : 
                       'Em atraso'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewSchoolFinancial(school.id)}>
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleGenerateInvoice}>
                          Gerar Fatura
                        </DropdownMenuItem>
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

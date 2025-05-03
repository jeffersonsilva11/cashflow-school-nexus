import React, { useState } from 'react';
import { 
  FileBarChart, 
  Download, 
  FileText, 
  Calendar, 
  ArrowUpRight, 
  Search,
  FileSpreadsheet,
  Filter,
  CreditCard,
  TrendingUp,
  PieChart,
  Users,
  School
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  RevenueByPlanChart 
} from '@/components/financial/RevenueByPlanChart';
import { 
  FinancialTrendChart 
} from '@/components/financial/FinancialTrendChart';
import { formatCurrency } from '@/lib/format';
import { SchoolUsageReport } from '@/components/reports/SchoolUsageReport';
import { ExportDataDialog } from '@/components/reports/ExportDataDialog';
import { ConsumptionAnalysisReport } from '@/components/reports/ConsumptionAnalysisReport';
import { 
  useFinancialOverview,
  useRevenueByPlan,
  useMonthlyTrend 
} from '@/services/financialReportHooks';
import { useSchoolsFinancial } from '@/services/schoolFinancialService';

export default function FinancialReports() {
  const { toast } = useToast();
  const [period, setPeriod] = useState('month');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch real data from services
  const { data: financialOverview, isLoading: overviewLoading } = useFinancialOverview();
  const { data: revenueByPlan, isLoading: revenueLoading } = useRevenueByPlan();
  const { data: monthlyTrend, isLoading: trendLoading } = useMonthlyTrend();
  const { data: schools = [], isLoading: schoolsLoading } = useSchoolsFinancial();
  
  // Filtrar escolas pela busca
  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gerar dados de transações por dia para o relatório
  const generateDailyTransactionData = () => {
    const days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 
                 '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', 
                 '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
    
    return days.map(day => ({
      date: `2025-05-${day}`,
      transactions: Math.floor(Math.random() * 200) + 50,
      amount: Math.floor(Math.random() * 5000) + 1000
    }));
  };

  const dailyTransactions = generateDailyTransactionData();

  const handleExportData = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados estão sendo exportados no formato ${format.toUpperCase()}. Você receberá o download em breve.`
    });
    // Simular download após um pequeno delay
    setTimeout(() => setIsExportDialogOpen(false), 1500);
  };

  // Loading state
  const isLoading = overviewLoading || revenueLoading || trendLoading || schoolsLoading;
  
  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h1>
            <p className="text-muted-foreground">
              Visualização detalhada dos dados financeiros e métricas do sistema
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground">Carregando dados financeiros...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">
            Visualização detalhada dos dados financeiros e métricas do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <FileSpreadsheet size={16} />
            Exportar Dados
          </Button>
          <Button className="gap-2">
            <FileText size={16} />
            Gerar Relatório
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="schools" className="flex items-center gap-2">
            <School size={16} />
            <span>Escolas</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Transações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Período e filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receita Total ({period === 'month' ? 'Mês' : period === 'year' ? 'Ano' : 'Período'})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(financialOverview?.totalRevenueMonth || 0)}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{financialOverview?.growthRate || 0}% em relação ao período anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Assinaturas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {financialOverview?.totalActiveSubscriptions || 0}
                </div>
                {financialOverview?.totalPendingPayments ? (
                  <div className="text-xs text-amber-600 mt-1">
                    {formatCurrency(financialOverview.totalPendingPayments)} em pagamentos pendentes
                  </div>
                ) : null}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Média de Receita por Escola
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(financialOverview?.averageRevenuePerSchool || 0)}
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>5.2% em relação ao período anterior</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taxa de Renovação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  98.2%
                </div>
                <div className="text-xs text-green-600 mt-1">
                  <span>1.5% acima da meta</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Tendência de Receita</CardTitle>
                <CardDescription>Evolução da receita no período</CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialTrendChart data={monthlyTrend || []} />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Plano</CardTitle>
                <CardDescription>Receita por tipo de plano</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueByPlanChart data={revenueByPlan || []} />
                <div className="mt-4 space-y-3">
                  {revenueByPlan && revenueByPlan.map((item) => (
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
          
          {/* Análise de Consumo */}
          <ConsumptionAnalysisReport />
        </TabsContent>

        <TabsContent value="schools" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar escola..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filtros
            </Button>
          </div>

          {/* Uso por escola */}
          <Card>
            <CardHeader>
              <CardTitle>Uso por Escola</CardTitle>
              <CardDescription>Análise detalhada do uso do sistema por cada escola</CardDescription>
            </CardHeader>
            <CardContent>
              <SchoolUsageReport schools={filteredSchools} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Calendar size={16} />
              Selecionar Período
            </Button>
          </div>

          {/* Transações diárias */}
          <Card>
            <CardHeader>
              <CardTitle>Transações Diárias (Maio/2025)</CardTitle>
              <CardDescription>Volume e valor das transações por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Qtde. Transações</TableHead>
                    <TableHead>Volume Total</TableHead>
                    <TableHead>Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyTransactions.slice(0, 10).map((day) => (
                    <TableRow key={day.date}>
                      <TableCell>{new Date(day.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{day.transactions}</TableCell>
                      <TableCell>{formatCurrency(day.amount)}</TableCell>
                      <TableCell>{formatCurrency(day.amount / day.transactions)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">
                  Ver todos os dias
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de exportação */}
      <ExportDataDialog 
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen} 
        onExport={handleExportData} 
      />
    </div>
  );
}

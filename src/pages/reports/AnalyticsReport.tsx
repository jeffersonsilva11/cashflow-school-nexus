
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, FileBarChart, Users, CreditCard, DollarSign, ArrowUpRight, TrendingUp, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ExportDataDialog } from '@/components/reports/ExportDataDialog';

// Dados simulados para gráficos
const transactionData = [
  { month: 'Jan', cantina: 15000, recarga: 22000, cantina_pct: 40.5, recarga_pct: 59.5 },
  { month: 'Fev', cantina: 18000, recarga: 23000, cantina_pct: 43.9, recarga_pct: 56.1 },
  { month: 'Mar', cantina: 16500, recarga: 25000, cantina_pct: 39.8, recarga_pct: 60.2 },
  { month: 'Abr', cantina: 19200, recarga: 24500, cantina_pct: 43.9, recarga_pct: 56.1 },
  { month: 'Mai', cantina: 21000, recarga: 26000, cantina_pct: 44.7, recarga_pct: 55.3 },
  { month: 'Jun', cantina: 19800, recarga: 25500, cantina_pct: 43.7, recarga_pct: 56.3 },
];

const userGrowthData = [
  { month: 'Jan', students: 2500, parents: 1800 },
  { month: 'Fev', students: 2700, parents: 1900 },
  { month: 'Mar', students: 2900, parents: 2100 },
  { month: 'Abr', students: 3100, parents: 2200 },
  { month: 'Mai', students: 3400, parents: 2500 },
  { month: 'Jun', students: 3600, parents: 2700 },
];

const deviceUsageData = [
  { name: 'Cartões', value: 65, color: '#4f46e5' },
  { name: 'Pulseiras', value: 25, color: '#06b6d4' },
  { name: 'Aplicativo', value: 10, color: '#10b981' },
];

const schoolsData = [
  { name: 'Colégio São Paulo', students: 850, devices: 780, transactions: 15600 },
  { name: 'Escola Maria Eduarda', students: 650, devices: 590, transactions: 12400 },
  { name: 'Colégio São Pedro', students: 720, devices: 650, transactions: 14200 },
  { name: 'Instituto Educação', students: 520, devices: 470, transactions: 9800 },
  { name: 'Escola Nova Geração', students: 430, devices: 380, transactions: 7600 },
];

export default function AnalyticsReport() {
  const [timeRange, setTimeRange] = useState('6m');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleExportData = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados analíticos estão sendo exportados no formato ${format.toUpperCase()}. Você receberá o download em breve.`
    });
    setTimeout(() => setIsExportDialogOpen(false), 1500);
  };

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Visão geral e análise do desempenho do sistema</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mês</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            Exportar Dados
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(transactionData.reduce((sum, item) => sum + item.cantina + item.recarga, 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12% em relação ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userGrowthData[userGrowthData.length - 1].students + userGrowthData[userGrowthData.length - 1].parents}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+8% em relação ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dispositivos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,275</div>
            <p className="text-xs text-muted-foreground mt-1">+5% em relação ao período anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.7%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.4% em relação ao período anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Transações</CardTitle>
            <CardDescription>Análise de transações por tipo ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), "Valor"]} 
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="cantina" name="Cantina" fill="#4f46e5" />
                  <Bar dataKey="recarga" name="Recarga" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Usuários</CardTitle>
            <CardDescription>Evolução no número de usuários registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    name="Alunos"
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="parents" 
                    name="Responsáveis"
                    stroke="#06b6d4" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance por Escola</CardTitle>
            <CardDescription>Comparativo de desempenho entre instituições</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escola</TableHead>
                  <TableHead>Total de Alunos</TableHead>
                  <TableHead>Dispositivos</TableHead>
                  <TableHead>Transações</TableHead>
                  <TableHead className="text-right">Taxa de Ativação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolsData.map((school) => (
                  <TableRow key={school.name}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.students}</TableCell>
                    <TableCell>{school.devices}</TableCell>
                    <TableCell>{school.transactions}</TableCell>
                    <TableCell className="text-right">
                      {Math.round((school.devices / school.students) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso de Dispositivos</CardTitle>
            <CardDescription>Distribuição por tipo de dispositivo</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Uso']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <ExportDataDialog 
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={handleExportData}
      />
    </div>
  );
}

// Componente de tabela reutilizável
const Table = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) => {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}

const TableHeader = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead {...props}>{children}</thead>
}

const TableBody = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody {...props}>{children}</tbody>
}

const TableFooter = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <tfoot {...props}>{children}</tfoot>
}

const TableRow = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => {
  return <tr {...props}>{children}</tr>
}

const TableHead = ({
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return <th {...props}>{children}</th>
}

const TableCell = ({
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return <td {...props}>{children}</td>
}

const TableCaption = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) => {
  return <caption {...props}>{children}</caption>
}

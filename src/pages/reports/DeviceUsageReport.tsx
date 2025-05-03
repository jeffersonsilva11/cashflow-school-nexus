
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, BarChart3, PieChart as PieChartIcon, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { DeviceStatusChart } from '@/components/devices/DeviceStatusChart';
import { DeviceAllocationChart } from '@/components/devices/DeviceAllocationChart';
import { useToast } from '@/hooks/use-toast';
import { SchoolUsageReport } from '@/components/reports/SchoolUsageReport';
import { ExportDataDialog } from '@/components/reports/ExportDataDialog';
import { schoolFinancials } from '@/services/financialMockData';

// Dados mockados para os gráficos
const deviceStatusData = {
  active: 245,
  inactive: 20,
  pending: 10,
  transit: 25
};

const deviceTypeData = [
  { name: 'Cartão RFID', value: 185, color: '#3b82f6' },
  { name: 'Pulseira', value: 95, color: '#8b5cf6' },
  { name: 'Outro', value: 20, color: '#f59e0b' },
];

const schoolAllocationData = [
  { name: 'Escola A', value: 120 },
  { name: 'Escola B', value: 85 },
  { name: 'Escola C', value: 65 },
  { name: 'Escola D', value: 30 },
];

const usageByTimeData = [
  { time: '08:00', transactions: 35 },
  { time: '09:00', transactions: 85 },
  { time: '10:00', transactions: 45 },
  { time: '11:00', transactions: 120 },
  { time: '12:00', transactions: 180 },
  { time: '13:00', transactions: 75 },
  { time: '14:00', transactions: 50 },
  { time: '15:00', transactions: 65 },
  { time: '16:00', transactions: 90 },
  { time: '17:00', transactions: 40 },
];

const usageByDayData = [
  { day: 'Segunda', transactions: 350 },
  { day: 'Terça', transactions: 275 },
  { day: 'Quarta', transactions: 390 },
  { day: 'Quinta', transactions: 320 },
  { day: 'Sexta', transactions: 410 },
];

// Mock school usage data
const getSchoolUsageData = (selectedSchool: string) => {
  if (selectedSchool === 'all') {
    return schoolFinancials.map(school => ({
      id: school.id,
      name: school.name,
      activeStudents: school.activeStudents,
      totalStudents: school.totalStudents,
      activeDevices: school.activeDevices,
      totalRevenue: school.totalRevenue
    }));
  }
  
  const school = schoolFinancials.find(school => school.id === selectedSchool.replace('school-', ''));
  
  return school ? [{
    id: school.id,
    name: school.name,
    activeStudents: school.activeStudents,
    totalStudents: school.totalStudents,
    activeDevices: school.activeDevices,
    totalRevenue: school.totalRevenue
  }] : [];
};

export default function DeviceUsageReport() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleExportData = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados dos dispositivos estão sendo exportados no formato ${format.toUpperCase()}. Você receberá o download em breve.`
    });
    setTimeout(() => setIsExportDialogOpen(false), 1500);
  };

  // Get school usage data based on selection
  const schoolUsageData = getSchoolUsageData(selectedSchool);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatório de Utilização de Dispositivos</h1>
          <p className="text-muted-foreground">Analise o uso e performance dos dispositivos no sistema</p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setIsExportDialogOpen(true)}
        >
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">300</div>
            <p className="text-xs text-muted-foreground mt-1">Total de Dispositivos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground mt-1">Dispositivos Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground mt-1">Taxa de Utilização</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1,890</div>
            <p className="text-xs text-muted-foreground mt-1">Transações no Período</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base">Visão Geral dos Dispositivos</CardTitle>
              <CardDescription>Status e distribuição dos dispositivos</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
                <SelectItem value="year">12 meses</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="status">
              <TabsList className="mb-4">
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="allocation">Alocação</TabsTrigger>
                <TabsTrigger value="type">Tipo</TabsTrigger>
              </TabsList>
              <TabsContent value="status" className="h-[300px] w-full">
                <DeviceStatusChart data={deviceStatusData} />
              </TabsContent>
              <TabsContent value="allocation" className="h-[300px] w-full">
                <DeviceAllocationChart data={schoolAllocationData} />
              </TabsContent>
              <TabsContent value="type" className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Padrões de Utilização</CardTitle>
            <CardDescription>Análise temporal do uso de dispositivos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Por Hora do Dia</Label>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageByTimeData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="transactions" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Por Dia da Semana</Label>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageByDayData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="transactions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilização por Escola</CardTitle>
          <CardDescription>Análise detalhada do uso de dispositivos por instituição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Label htmlFor="school-select">Escola:</Label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-[250px]" id="school-select">
                <SelectValue placeholder="Selecione uma escola" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Escolas</SelectItem>
                <SelectItem value="school-1">Escola A</SelectItem>
                <SelectItem value="school-2">Escola B</SelectItem>
                <SelectItem value="school-3">Escola C</SelectItem>
                <SelectItem value="school-4">Escola D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <SchoolUsageReport schools={schoolUsageData} />
        </CardContent>
      </Card>

      <ExportDataDialog 
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={handleExportData}
      />
    </div>
  );
}

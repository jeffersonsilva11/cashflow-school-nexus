
import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  BarChart3,
  Download,
  FileSpreadsheet 
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { DeviceStatusChart } from '@/components/devices/DeviceStatusChart';
import { DeviceAllocationChart } from '@/components/devices/DeviceAllocationChart';
import { ExportDataDialog } from '@/components/reports/ExportDataDialog';
import { formatNumber } from '@/lib/format';
import { deviceAlertService, AlertType } from '@/services/deviceAlertService';

export default function DeviceUsageReport() {
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [period, setPeriod] = useState('month');
  
  const deviceStats = {
    total: 385,
    active: 352,
    inactive: 18,
    damaged: 15
  };
  
  const devicesBySchool = [
    { name: "Colégio Integrado", total: 35, active: 33, inactive: 2 },
    { name: "Escola Maria Eduarda", total: 25, active: 24, inactive: 1 },
    { name: "Colégio São Pedro", total: 18, active: 16, inactive: 2 },
    { name: "Escola Técnica Federal", total: 30, active: 29, inactive: 1 },
    { name: "Instituto Educacional Fortaleza", total: 22, active: 20, inactive: 2 }
  ];
  
  const handleExportData = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados de uso de dispositivos estão sendo exportados no formato ${format.toUpperCase()}. Você receberá o download em breve.`
    });
    setTimeout(() => setIsExportDialogOpen(false), 1500);
  };
  
  // Gerar dados simulados para o gráfico de atividade de dispositivos
  const generateDeviceActivityData = () => {
    return Array.from({ length: 24 }, (_, i) => {
      // Mais atividade durante horários de pico escolar
      const isSchoolHour = i >= 7 && i <= 17;
      const baseActivity = isSchoolHour ? 75 : 15;
      const variance = isSchoolHour ? 25 : 10;
      
      return {
        hour: `${i.toString().padStart(2, '0')}:00`,
        terminals: Math.max(0, Math.floor(baseActivity * 1.2 + Math.random() * variance)),
        wristbands: Math.max(0, Math.floor(baseActivity * 0.8 + Math.random() * variance))
      };
    });
  };
  
  const deviceActivityData = generateDeviceActivityData();
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Uso de Dispositivos</h1>
          <p className="text-muted-foreground">
            Análise detalhada do uso e estado dos dispositivos no sistema
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
            <BarChart3 size={16} />
            Relatório Avançado
          </Button>
        </div>
      </div>
      
      {/* Filtros */}
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por ID ou nome do dispositivo..."
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Dispositivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(deviceStats.total)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Todos os dispositivos cadastrados
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dispositivos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(deviceStats.active)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((deviceStats.active / deviceStats.total) * 100)}% do total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dispositivos Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatNumber(deviceStats.inactive)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((deviceStats.inactive / deviceStats.total) * 100)}% do total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dispositivos Danificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatNumber(deviceStats.damaged)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((deviceStats.damaged / deviceStats.total) * 100)}% do total
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status dos Dispositivos</CardTitle>
            <CardDescription>Distribuição de dispositivos por status</CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceStatusChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alocação de Dispositivos</CardTitle>
            <CardDescription>Distribuição por tipo e uso</CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceAllocationChart />
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs com relatórios por tipos de dispositivos */}
      <Tabs defaultValue="terminals">
        <TabsList>
          <TabsTrigger value="terminals">Terminais</TabsTrigger>
          <TabsTrigger value="wristbands">Pulseiras</TabsTrigger>
          <TabsTrigger value="cards">Cartões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terminals" className="border rounded-md mt-4 p-4">
          <h3 className="text-lg font-medium mb-4">Uso de Terminais por Hora</h3>
          <div className="h-64">
            {/* Aqui poderia ser incluído um gráfico de barras mostrando o uso por hora */}
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Gráfico de atividade horária dos terminais
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Distribuição por Escola</h4>
            <div className="space-y-4">
              {devicesBySchool.map((school) => (
                <div key={school.name} className="flex items-center justify-between">
                  <span>{school.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{school.active}/{school.total}</span>
                    <div 
                      className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden"
                    >
                      <div 
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${(school.active / school.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wristbands" className="border rounded-md mt-4 p-4">
          <div className="text-center py-12 text-muted-foreground">
            Relatório detalhado de uso de pulseiras será exibido aqui
          </div>
        </TabsContent>
        
        <TabsContent value="cards" className="border rounded-md mt-4 p-4">
          <div className="text-center py-12 text-muted-foreground">
            Relatório detalhado de uso de cartões será exibido aqui
          </div>
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

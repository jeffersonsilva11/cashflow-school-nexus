
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useDeviceStatusReport, useDeviceBatteryReport, useDeviceUsageReport } from '@/services/deviceReportHooks';
import { Progress } from '@/components/ui/progress';

const DeviceReports = () => {
  const { data: statusData, isLoading: statusLoading } = useDeviceStatusReport();
  const { data: batteryData, isLoading: batteryLoading } = useDeviceBatteryReport();
  const { data: usageData, isLoading: usageLoading } = useDeviceUsageReport();

  const isLoading = statusLoading || batteryLoading || usageLoading;
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios de Dispositivos</h1>
            <p className="text-muted-foreground">
              Análise e estatísticas dos dispositivos no sistema
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground">Carregando dados dos dispositivos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Dispositivos</h1>
          <p className="text-muted-foreground">
            Análise e estatísticas dos dispositivos no sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="battery">Bateria</TabsTrigger>
          <TabsTrigger value="usage">Uso</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status dos Dispositivos</CardTitle>
              <CardDescription>Distribuição dos dispositivos por status</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                      label={({ status, percentage }) => `${status}: ${percentage}%`}
                    >
                      {statusData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} dispositivos`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-4">Dispositivos por Status</h3>
                <div className="space-y-4">
                  {statusData?.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{item.status}</span>
                        </div>
                        <div className="font-medium">{item.count} ({item.percentage}%)</div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="battery">
          <Card>
            <CardHeader>
              <CardTitle>Níveis de Bateria</CardTitle>
              <CardDescription>Distribuição dos dispositivos por nível de bateria</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={batteryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="level" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value} dispositivos`, 'Quantidade']} />
                    <Legend />
                    <Bar dataKey="count" name="Dispositivos" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-4">Distribuição de Bateria</h3>
                <div className="space-y-4">
                  {batteryData?.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{item.level}</span>
                        </div>
                        <div className="font-medium">{item.count} ({item.percentage}%)</div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Uso de Dispositivos</CardTitle>
              <CardDescription>Análise de uso dos dispositivos ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={usageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="daily_active" name="Dispositivos Ativos Diários" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="monthly_active" name="Dispositivos Ativos Mensais" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="total" name="Total de Dispositivos" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h4 className="font-medium">Dispositivos Ativos Diários</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {usageData && usageData.length > 0 ? usageData[usageData.length - 1].daily_active : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Último mês</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h4 className="font-medium">Dispositivos Ativos Mensais</h4>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        {usageData && usageData.length > 0 ? usageData[usageData.length - 1].monthly_active : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Último mês</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h4 className="font-medium">Taxa de Atividade</h4>
                      <p className="text-2xl font-bold text-amber-600 mt-2">
                        {usageData && usageData.length > 0 
                          ? `${Math.round((usageData[usageData.length - 1].daily_active / usageData[usageData.length - 1].total) * 100)}%`
                          : '0%'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">Dispositivos ativos/total</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceReports;

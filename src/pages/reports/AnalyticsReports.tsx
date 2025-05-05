
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { useTransactionTrendsReport, useUserBehaviorReport, useProductCategoryReport } from '@/services/analyticsReportHooks';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

const AnalyticsReports = () => {
  const { data: trendsData, isLoading: trendsLoading } = useTransactionTrendsReport();
  const { data: behaviorData, isLoading: behaviorLoading } = useUserBehaviorReport();
  const { data: categoryData, isLoading: categoryLoading } = useProductCategoryReport();

  const isLoading = trendsLoading || behaviorLoading || categoryLoading;
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios Analíticos</h1>
            <p className="text-muted-foreground">
              Análise de dados e tendências do sistema
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground">Carregando dados analíticos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Analíticos</h1>
          <p className="text-muted-foreground">
            Análise de dados e tendências do sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue="trends">
        <TabsList className="mb-4">
          <TabsTrigger value="trends">Tendências de Transações</TabsTrigger>
          <TabsTrigger value="behavior">Comportamento do Usuário</TabsTrigger>
          <TabsTrigger value="categories">Categorias de Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Transações</CardTitle>
              <CardDescription>Análise de transações dos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(parseISO(date), 'dd/MM', {locale: pt})} 
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'amount' ? formatCurrency(Number(value)) : value, 
                        name === 'amount' ? 'Valor Total' : 'Quantidade'
                      ]}
                      labelFormatter={(date) => format(parseISO(date.toString()), 'dd/MM/yyyy', {locale: pt})}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="count" name="Quantidade" fill="#8884d8" stroke="#8884d8" yAxisId="left" />
                    <Area type="monotone" dataKey="amount" name="Valor Total" fill="#82ca9d" stroke="#82ca9d" yAxisId="right" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h4 className="font-medium">Total de Transações</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {trendsData?.reduce((sum, item) => sum + item.count, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Último período</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h4 className="font-medium">Valor Total</h4>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        {formatCurrency(trendsData?.reduce((sum, item) => sum + item.amount, 0) || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Último período</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h4 className="font-medium">Ticket Médio</h4>
                      <p className="text-2xl font-bold text-amber-600 mt-2">
                        {formatCurrency(
                          (trendsData?.reduce((sum, item) => sum + item.amount, 0) || 0) / 
                          (trendsData?.reduce((sum, item) => sum + item.count, 0) || 1)
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Valor médio por transação</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Comportamento do Usuário</CardTitle>
              <CardDescription>Análise de padrões de uso por hora do dia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={behaviorData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} transações`, 'Quantidade']} />
                    <Legend />
                    <Bar dataKey="transactions" name="Transações" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Horários de Pico</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {behaviorData
                    ?.sort((a, b) => b.transactions - a.transactions)
                    .slice(0, 3)
                    .map((peak, index) => (
                      <Card key={index} className="bg-muted/20">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <h4 className="font-medium">{peak.hour}</h4>
                            <p className="text-2xl font-bold text-purple-600 mt-2">{peak.transactions}</p>
                            <p className="text-sm text-muted-foreground">transações</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Produtos</CardTitle>
              <CardDescription>Análise de vendas por categoria de produto</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="category"
                      label={({ category, value }) => `${category}: ${value}%`}
                    >
                      {categoryData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-4">Vendas por Categoria</h3>
                <div className="space-y-4">
                  {categoryData?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 mr-2 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.category}</span>
                      </div>
                      <div className="font-medium">
                        {item.count} itens ({item.value}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsReports;

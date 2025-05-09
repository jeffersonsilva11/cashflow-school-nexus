
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlyTrend, useConsumptionAnalysis } from '@/services/financialReportHooks';
import { FinancialTrendChart } from '@/components/financial/FinancialTrendChart';
import { fetchVendors } from '@/services/vendorService';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Utensils, ChartBar, FileBarChart, ArrowRightCircle, Wallet, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Canteen() {
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const navigate = useNavigate();

  // Consulta para buscar todos os estabelecimentos (cantinas)
  const { data: vendors, isLoading: loadingVendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => fetchVendors(),
  });

  // Buscamos dados de tendências e análise de consumo para o vendedor selecionado
  const { data: monthlyTrendData, isLoading: loadingTrend } = useMonthlyTrend(selectedVendor === 'all' ? undefined : selectedVendor);
  const { data: consumptionData, isLoading: loadingConsumption } = useConsumptionAnalysis(selectedVendor === 'all' ? undefined : selectedVendor);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cantina</h1>
          <p className="text-muted-foreground">Gestão da cantina escolar</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/vendors')}>
            <Utensils className="h-4 w-4 mr-2" />
            Gerenciar Estabelecimentos
          </Button>
          <Button onClick={() => navigate('/canteen/terminals')}>
            <CreditCard className="h-4 w-4 mr-2" />
            Terminais de Pagamento
          </Button>
          <Button onClick={() => navigate('/canteen/recharges')}>
            <Wallet className="h-4 w-4 mr-2" />
            Recargas
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="font-medium">Selecione uma cantina:</div>
        <Select 
          value={selectedVendor} 
          onValueChange={(value) => setSelectedVendor(value)}
          disabled={loadingVendors}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Selecione uma cantina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cantinas</SelectItem>
            {vendors?.map(vendor => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.name} ({vendor.type === 'own' ? 'Própria' : 'Terceirizada'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Total de Vendas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingTrend ? (
                <div className="h-8 w-24 bg-muted/30 animate-pulse rounded"></div>
              ) : (
                formatCurrency(monthlyTrendData?.reduce((sum, item) => sum + item.revenue, 0) || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedVendor === 'all' ? 'Em todas as cantinas' : 'Nessa cantina'}
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total de Transações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingConsumption ? (
                <div className="h-8 w-20 bg-muted/30 animate-pulse rounded"></div>
              ) : (
                consumptionData?.reduce((sum, item) => sum + item.quantity, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de transações registradas
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Ticket Médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingConsumption || loadingTrend ? (
                <div className="h-8 w-24 bg-muted/30 animate-pulse rounded"></div>
              ) : (
                formatCurrency(
                  (monthlyTrendData?.reduce((sum, item) => sum + item.revenue, 0) || 0) / 
                  (consumptionData?.reduce((sum, item) => sum + item.quantity, 0) || 1)
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Média por transação
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">Tendências de Vendas</TabsTrigger>
          <TabsTrigger value="analytics">Análise de Consumo</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Vendas</CardTitle>
              <CardDescription>
                Vendas mensais {selectedVendor === 'all' ? 'de todas as cantinas' : 'da cantina selecionada'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {loadingTrend ? (
                <div className="h-80 w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Carregando dados...</p>
                </div>
              ) : !monthlyTrendData || monthlyTrendData.length === 0 ? (
                <div className="h-80 w-full border rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-muted-foreground mb-4">Nenhum dado de vendas disponível</p>
                    <Button variant="outline" onClick={() => navigate('/transactions')}>
                      Ver Transações
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-80">
                  <FinancialTrendChart data={monthlyTrendData} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Consumo</CardTitle>
              <CardDescription>
                Estatísticas de consumo por escola {selectedVendor === 'all' ? '' : 'na cantina selecionada'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingConsumption ? (
                <div className="h-64 w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Carregando dados...</p>
                </div>
              ) : !consumptionData || consumptionData.length === 0 ? (
                <div className="h-64 w-full border rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-muted-foreground mb-4">Nenhum dado de consumo disponível</p>
                    <Button variant="outline" onClick={() => navigate('/transactions')}>
                      Ver Transações
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Escola</TableHead>
                        <TableHead>Cantina</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                        <TableHead className="text-right">Transações</TableHead>
                        <TableHead className="text-right">Média por Estudante</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consumptionData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.schoolName}</TableCell>
                          <TableCell>{item.vendorName || '-'}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.averagePerStudent)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => item.vendorId && navigate(`/vendors/${item.vendorId}`)}
                            >
                              <ArrowRightCircle className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

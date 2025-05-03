
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVendors, fetchVendorFinancials, fetchSalesReports, fetchVendorTransfers } from '@/services/vendorService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';

const ThirdPartyDashboard = () => {
  const navigate = useNavigate();
  
  const { data: vendors } = useQuery({
    queryKey: ['thirdPartyVendors'],
    queryFn: () => fetchVendors('third_party'),
  });
  
  // Sample data for the chart - in a real scenario, you would fetch this from your backend
  const sampleChartData = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      month: format(date, 'MMM', { locale: pt }),
      sales: Math.floor(Math.random() * 50000) + 10000,
      commission: Math.floor(Math.random() * 5000) + 1000,
    };
  });
  
  const totalVendors = vendors?.length || 0;
  const activeVendors = vendors?.filter(v => v.active).length || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', 
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Cantinas Terceirizadas</h1>
        <Button onClick={() => navigate('/vendors')}>
          Ver Todas as Cantinas
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Cantinas Terceirizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVendors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cantinas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeVendors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comissões do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(sampleChartData[sampleChartData.length - 1].commission)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vendas e Comissões</CardTitle>
          <CardDescription>Evolução de vendas e comissões nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} />
                <Tooltip 
                  formatter={(value, name) => [
                    formatCurrency(Number(value)), 
                    name === 'sales' ? 'Vendas' : 'Comissões'
                  ]} 
                />
                <Bar dataKey="sales" name="Vendas" fill="#8884d8" />
                <Bar dataKey="commission" name="Comissões" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comissões por Cantina</CardTitle>
            <CardDescription>Comissões do último mês por cantina</CardDescription>
          </CardHeader>
          <CardContent>
            {vendors && vendors.length > 0 ? (
              <ul className="space-y-2">
                {vendors.slice(0, 5).map((vendor) => (
                  <li key={vendor.id} className="flex justify-between items-center border-b pb-2">
                    <span>{vendor.name}</span>
                    <span className="font-medium">
                      {formatCurrency(Math.floor(Math.random() * 3000) + 500)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhuma cantina terceirizada cadastrada.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => navigate('/reports/financial')}>
              Ver relatório completo
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Repasses Pendentes</CardTitle>
            <CardDescription>Repasses financeiros pendentes para cantinas</CardDescription>
          </CardHeader>
          <CardContent>
            {vendors && vendors.length > 0 ? (
              <ul className="space-y-2">
                {vendors.slice(0, 5).map((vendor) => (
                  <li key={vendor.id} className="flex justify-between items-center border-b pb-2">
                    <span>{vendor.name}</span>
                    <span className="font-medium">
                      {formatCurrency(Math.floor(Math.random() * 5000) + 1000)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhum repasse pendente.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => navigate('/financial/billing')}>
              Ver todos os repasses
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ThirdPartyDashboard;

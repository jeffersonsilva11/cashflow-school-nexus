
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchVendor, 
  fetchVendorFinancials,
  fetchCommissionTiers,
  fetchSalesReports,
  fetchVendorTransfers
} from '@/services/vendorService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorFinancials } from '@/components/vendors/VendorFinancials';
import { CommissionTiers } from '@/components/vendors/CommissionTiers';
import { SalesReports } from '@/components/vendors/SalesReports';
import { TransferHistory } from '@/components/vendors/TransferHistory';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const VendorDetails = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [activeTab, setActiveTab] = useState('financials');
  
  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => fetchVendor(vendorId!),
    enabled: !!vendorId,
  });
  
  const { data: financials, isLoading: financialsLoading } = useQuery({
    queryKey: ['vendorFinancials', vendorId],
    queryFn: () => fetchVendorFinancials(vendorId!),
    enabled: !!vendorId,
  });
  
  const { data: commissionTiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['commissionTiers', vendorId],
    queryFn: () => fetchCommissionTiers(vendorId!),
    enabled: !!vendorId,
  });
  
  const { data: salesReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['salesReports', vendorId],
    queryFn: () => fetchSalesReports(vendorId!),
    enabled: !!vendorId,
  });
  
  const { data: transfers, isLoading: transfersLoading } = useQuery({
    queryKey: ['vendorTransfers', vendorId],
    queryFn: () => fetchVendorTransfers(vendorId!),
    enabled: !!vendorId,
  });
  
  if (vendorLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted/50 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted/30 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-muted/20 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!vendor) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Cantina não encontrada</CardTitle>
            <CardDescription>Não foi possível encontrar detalhes para esta cantina.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{vendor.name}</h1>
            <Badge variant={vendor.type === 'third_party' ? "secondary" : "outline"}>
              {vendor.type === 'third_party' ? 'Terceirizada' : 'Própria'}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {vendor.school?.name || 'Sem escola associada'} • {vendor.location || 'Localização não especificada'}
          </p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome do contato</p>
              <p className="font-medium">{vendor.contact_name || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{vendor.contact_email || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{vendor.contact_phone || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {vendor.type === 'third_party' && (
        <>
          <Separator className="my-6" />
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full sm:w-auto grid-cols-1 sm:grid-cols-4">
              <TabsTrigger value="financials">Financeiro</TabsTrigger>
              <TabsTrigger value="commissions">Comissões</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
              <TabsTrigger value="transfers">Histórico de Repasses</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="financials" className="space-y-6">
                <VendorFinancials 
                  financials={financials} 
                  isLoading={financialsLoading} 
                />
              </TabsContent>
              
              <TabsContent value="commissions">
                <CommissionTiers 
                  tiers={commissionTiers || []} 
                  isLoading={tiersLoading} 
                />
              </TabsContent>
              
              <TabsContent value="reports">
                <SalesReports 
                  reports={salesReports || []} 
                  isLoading={reportsLoading} 
                />
              </TabsContent>
              
              <TabsContent value="transfers">
                <TransferHistory 
                  transfers={transfers || []} 
                  isLoading={transfersLoading} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default VendorDetails;

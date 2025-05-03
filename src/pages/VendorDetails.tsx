
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchVendor, fetchVendorFinancials, fetchCommissionTiers, fetchSalesReports, fetchVendorTransfers, fetchVendorProducts } from '@/services/vendorService';
import { paymentGatewayService, PaymentTerminal } from '@/services/paymentGatewayService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VendorFinancials } from '@/components/vendors/VendorFinancials';
import { CommissionTiers } from '@/components/vendors/CommissionTiers';
import { TransferHistory } from '@/components/vendors/TransferHistory';
import { PaymentTerminals } from '@/components/vendors/PaymentTerminals';
import { useNavigate } from 'react-router-dom';

const VendorDetails = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const [terminals, setTerminals] = useState<PaymentTerminal[]>([]);
  const [terminalsLoading, setTerminalsLoading] = useState(true);
  
  const { data: vendor, isLoading: isLoadingVendor } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => fetchVendor(vendorId!),
    enabled: !!vendorId,
  });
  
  const { data: financials, isLoading: isLoadingFinancials } = useQuery({
    queryKey: ['vendor-financials', vendorId],
    queryFn: () => fetchVendorFinancials(vendorId!),
    enabled: !!vendorId,
  });
  
  const { data: commissionTiers, isLoading: isLoadingCommissionTiers } = useQuery({
    queryKey: ['commission-tiers', vendorId],
    queryFn: () => fetchCommissionTiers(vendorId!),
    enabled: !!vendorId,
  });
  
  const { data: transfers, isLoading: isLoadingTransfers } = useQuery({
    queryKey: ['vendor-transfers', vendorId],
    queryFn: () => fetchVendorTransfers(vendorId!),
    enabled: !!vendorId,
  });
  
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['vendor-products', vendorId],
    queryFn: () => fetchVendorProducts(vendorId!),
    enabled: !!vendorId,
  });
  
  // Load payment terminals
  useEffect(() => {
    const loadTerminals = async () => {
      if (!vendorId) return;
      
      setTerminalsLoading(true);
      try {
        const terminals = await paymentGatewayService.getTerminals({ vendorId });
        
        // For demo purposes, add some mock terminals if none exist
        if (terminals.length === 0 && vendor?.type === 'third_party') {
          setTerminals([
            {
              id: 'term-1',
              terminal_id: 'STN12345',
              serial_number: 'SN98765432',
              model: 'Stone S920',
              gateway: 'stone',
              vendor_id: vendorId,
              school_id: vendor?.school_id || '',
              status: 'active',
              last_sync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
              firmware_version: '2.5.1',
              battery_level: 85,
              connection_status: 'online'
            },
            {
              id: 'term-2',
              terminal_id: 'STN54321',
              serial_number: 'SN12345678',
              model: 'Stone Mini',
              gateway: 'stone',
              vendor_id: vendorId,
              school_id: vendor?.school_id || '',
              status: 'inactive',
              last_sync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
              firmware_version: '2.4.9',
              connection_status: 'offline'
            }
          ]);
        } else {
          setTerminals(terminals);
        }
      } catch (error) {
        console.error('Error loading terminals:', error);
      } finally {
        setTerminalsLoading(false);
      }
    };
    
    if (vendor) {
      loadTerminals();
    }
  }, [vendorId, vendor]);
  
  if (isLoadingVendor) {
    return <div className="container mx-auto py-6">Carregando detalhes do fornecedor...</div>;
  }
  
  if (!vendor) {
    return <div className="container mx-auto py-6">Fornecedor não encontrado</div>;
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-muted-foreground">
            {vendor.type === 'third_party' ? 'Cantina Terceirizada' : 'Cantina Própria'} • 
            {vendor.school?.name || 'Sem escola associada'}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contato</p>
                <p className="font-medium">{vendor.contact_name || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                <p className="font-medium">{vendor.contact_phone || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{vendor.contact_email || 'Não informado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financials">Financeiro</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="terminals">Terminais de Pagamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VendorFinancials financials={financials} isLoading={isLoadingFinancials} />
            <CommissionTiers tiers={commissionTiers || []} isLoading={isLoadingCommissionTiers} />
          </div>
          
          <TransferHistory transfers={transfers || []} isLoading={isLoadingTransfers} />
        </TabsContent>
        
        <TabsContent value="financials">
          <div className="space-y-4">
            <VendorFinancials financials={financials} isLoading={isLoadingFinancials} />
            <CommissionTiers tiers={commissionTiers || []} isLoading={isLoadingCommissionTiers} />
            <TransferHistory transfers={transfers || []} isLoading={isLoadingTransfers} />
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>
                {products?.length || 0} produtos cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProducts ? (
                <p>Carregando produtos...</p>
              ) : products?.length ? (
                <ul className="divide-y">
                  {products.map((product) => (
                    <li key={product.id} className="py-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.description || 'Sem descrição'}</p>
                        </div>
                        <div>
                          <p className="text-right font-bold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                          </p>
                          {product.active === false && (
                            <p className="text-xs text-muted-foreground">Inativo</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  Nenhum produto cadastrado para este fornecedor.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="terminals">
          <PaymentTerminals terminals={terminals} isLoading={terminalsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorDetails;

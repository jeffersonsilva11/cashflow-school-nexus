
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paymentGatewayService } from '@/services/paymentGatewayService';
import { useQuery } from '@tanstack/react-query';
import { PaymentTerminals } from '@/components/vendors/PaymentTerminals';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchVendors } from '@/services/vendorService';

export default function CanteenTerminals() {
  const navigate = useNavigate();
  const [selectedVendor, setSelectedVendor] = React.useState<string>('all');

  const { data: vendors, isLoading: loadingVendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => fetchVendors(),
  });

  const { data: terminals, isLoading: loadingTerminals } = useQuery({
    queryKey: ['terminals', selectedVendor],
    queryFn: () => paymentGatewayService.getTerminals({ 
      vendorId: selectedVendor === 'all' ? undefined : selectedVendor
    }),
    enabled: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/canteen')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Terminais de Pagamento</h1>
          <p className="text-muted-foreground">Gerenciamento de terminais e maquininhas da cantina</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Terminais de Pagamento</CardTitle>
            <CardDescription>Gerenciar maquininhas e dispositivos de pagamento</CardDescription>
          </div>
          <Button onClick={() => navigate('/canteen/terminals/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Terminal
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="font-medium">Filtrar por cantina:</div>
              <Select 
                value={selectedVendor} 
                onValueChange={(value) => setSelectedVendor(value)}
                disabled={loadingVendors}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Todas as cantinas" />
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
          </div>
          
          <PaymentTerminals 
            terminals={terminals || []} 
            isLoading={loadingTerminals} 
          />
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVendors } from '@/services/vendorService';
import { VendorsList } from '@/components/vendors/VendorsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Vendors = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'third_party' | 'own'>('all');
  const navigate = useNavigate();
  
  const { data: allVendors, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => fetchVendors(),
  });
  
  const filterVendors = () => {
    if (!allVendors) return [];
    if (activeTab === 'all') return allVendors;
    return allVendors.filter(vendor => vendor.type === activeTab);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Cantinas</h1>
        <Button onClick={() => navigate('/vendors/new')}>
          Nova Cantina
        </Button>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'all' | 'third_party' | 'own')}
        className="w-full mb-6"
      >
        <TabsList className="grid w-full sm:w-auto grid-cols-3">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="third_party">Terceirizadas</TabsTrigger>
          <TabsTrigger value="own">Próprias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <VendorsList vendors={filterVendors()} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="third_party" className="mt-6">
          <VendorsList vendors={filterVendors()} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="own" className="mt-6">
          <VendorsList vendors={filterVendors()} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vendors;

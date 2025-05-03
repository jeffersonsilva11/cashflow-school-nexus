
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Server, TabletIcon } from 'lucide-react';
import { CardsDevicesTab } from '@/components/devices/CardsDevicesTab';
import { TerminalsDevicesTab } from '@/components/devices/TerminalsDevicesTab';
import { TabletsDevicesTab } from '@/components/devices/TabletsDevicesTab';

export default function Devices() {
  const [activeTab, setActiveTab] = useState("cards");
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispositivos</h1>
          <p className="text-muted-foreground">Gerencie cartões, pulseiras, maquininhas e tablets do sistema.</p>
        </div>
      </div>
      
      <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Cartões/Pulseiras</span>
          </TabsTrigger>
          <TabsTrigger value="terminals" className="flex items-center gap-2">
            <Server size={16} />
            <span>Maquininhas</span>
          </TabsTrigger>
          <TabsTrigger value="tablets" className="flex items-center gap-2">
            <TabletIcon size={16} />
            <span>Tablets</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="space-y-6">
          <CardsDevicesTab />
        </TabsContent>
        
        <TabsContent value="terminals" className="space-y-6">
          <TerminalsDevicesTab />
        </TabsContent>
        
        <TabsContent value="tablets" className="space-y-6">
          <TabletsDevicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

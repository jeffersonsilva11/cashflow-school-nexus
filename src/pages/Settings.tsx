
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent } from '@/components/ui/tabs';
import GeneralSettings from '@/components/settings/GeneralSettings';
import PaymentGatewaySettings from '@/components/settings/PaymentGatewaySettings';
import MapSettings from '@/components/settings/MapSettings';
import FinancialSettings from '@/components/settings/FinancialSettings';
import NFCSettings from '@/components/settings/NFCSettings';

const Settings = () => {
  const { section } = useParams<{ section?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse the hash from the URL
  const hash = location.hash.replace('#', '');
  
  // Determine the active tab
  const getActiveTab = () => {
    if (section) {
      return section;
    }
    if (hash) {
      return hash;
    }
    return 'general';
  };
  
  const activeTab = getActiveTab();
  
  // Fetch table definitions to check if the required tables exist
  const { data: tableExists } = useQuery({
    queryKey: ['check-settings-tables'],
    queryFn: async () => {
      // Check if the system_configs table exists
      const { data: systemConfigTable, error: systemConfigError } = await supabase
        .from('system_configs')
        .select('count(*)');
      
      // Check if the payment_gateway_configs table exists
      const { data: gatewayConfigTable, error: gatewayConfigError } = await supabase
        .from('payment_gateway_configs')
        .select('count(*)');
      
      // Check if the payment_provider_configs table exists
      const { data: providerConfigTable, error: providerConfigError } = await supabase
        .from('payment_provider_configs')
        .select('count(*)');
      
      return {
        systemConfigExists: !systemConfigError,
        gatewayConfigExists: !gatewayConfigError,
        providerConfigExists: !providerConfigError,
      };
    },
    retry: false,
  });
  
  const handleTabChange = (value: string) => {
    navigate(`/settings#${value}`);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as configurações e integrações da plataforma
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar navigation */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                <li>
                  <button 
                    onClick={() => handleTabChange('general')}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${activeTab === 'general' ? 'bg-slate-50 border-l-4 border-primary' : ''}`}
                  >
                    <span className="font-medium">Geral</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleTabChange('payment-gateways')}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${activeTab === 'payment-gateways' ? 'bg-slate-50 border-l-4 border-primary' : ''}`}
                  >
                    <span className="font-medium">Gateways de Pagamento</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleTabChange('financial')}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${activeTab === 'financial' ? 'bg-slate-50 border-l-4 border-primary' : ''}`}
                  >
                    <span className="font-medium">Serviços Financeiros</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleTabChange('maps')}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${activeTab === 'maps' ? 'bg-slate-50 border-l-4 border-primary' : ''}`}
                  >
                    <span className="font-medium">Mapas</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleTabChange('nfc')}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${activeTab === 'nfc' ? 'bg-slate-50 border-l-4 border-primary' : ''}`}
                  >
                    <span className="font-medium">NFC</span>
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">Importante</p>
              <p className="text-sm text-yellow-700 mt-1">
                As configurações definidas aqui serão aplicadas a todo o sistema. 
                Certifique-se de verificar as configurações antes de ativar qualquer integração.
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-9">
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
            
            <TabsContent value="payment-gateways">
              <PaymentGatewaySettings />
            </TabsContent>
            
            <TabsContent value="financial">
              <FinancialSettings />
            </TabsContent>
            
            <TabsContent value="maps">
              <MapSettings />
            </TabsContent>
            
            <TabsContent value="nfc">
              <NFCSettings />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;

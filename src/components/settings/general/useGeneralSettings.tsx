
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { GeneralConfig } from './GeneralSettingsForm';

export const useGeneralSettings = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Fetch existing configuration
  const { data: generalConfig, isLoading, refetch } = useQuery({
    queryKey: ['general-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configs')
        .select('*')
        .eq('config_key', 'general')
        .single();
      
      if (error) {
        // Return default config if not found
        return { 
          config_key: 'general',
          company_name: 'Cashflow School Nexus',
          logo_url: '',
          timezone: 'America/Sao_Paulo',
          date_format: 'DD/MM/YYYY',
          time_format: '24h',
          default_currency: 'BRL',
          support_email: '',
          support_phone: '',
          terms_url: '',
          privacy_url: '',
          config: {},
          updated_at: new Date().toISOString() // Add this field to default
        };
      }
      
      // Ensure date_format is one of the allowed values
      const validDateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
      const validatedData = {
        ...data,
        date_format: validDateFormats.includes(data.date_format) ? 
          data.date_format : 'DD/MM/YYYY',
        time_format: ['12h', '24h'].includes(data.time_format) ?
          data.time_format : '24h'
      };
      
      return validatedData;
    },
  });
  
  // Save configuration
  const saveConfig = async (data: GeneralConfig) => {
    try {
      const { error } = await supabase
        .from('system_configs')
        .upsert({
          config_key: 'general',
          company_name: data.company_name,
          logo_url: data.logo_url || '',
          timezone: data.timezone,
          date_format: data.date_format,
          time_format: data.time_format,
          default_currency: data.default_currency,
          support_email: data.support_email || '',
          support_phone: data.support_phone || '',
          terms_url: data.terms_url || '',
          privacy_url: data.privacy_url || '',
          config: {
            company_name: data.company_name,
            logo_url: data.logo_url,
            timezone: data.timezone,
            date_format: data.date_format,
            time_format: data.time_format,
            default_currency: data.default_currency,
          },
        });
      
      if (error) throw error;
      
      toast.success('Configurações gerais atualizadas com sucesso');
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Erro ao salvar configurações gerais:', error);
      toast.error('Erro ao salvar configurações gerais');
    }
  };

  // Upload logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Arquivo muito grande. O tamanho máximo é 2MB.');
      return;
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `logos/${Date.now()}.${fileExt}`;
    
    try {
      toast.info('Enviando logo...');
      
      // In a real implementation, we would upload to Supabase Storage
      // For now, we'll just simulate an upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is where we'd update the form with the uploaded URL
      // For now, we'll just simulate a successful upload with a fake URL
      toast.success('Logo enviado com sucesso');
      return `https://example.com/${fileName}`;
    } catch (error) {
      console.error('Erro ao enviar logo:', error);
      toast.error('Erro ao enviar logo');
      return null;
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  return {
    generalConfig,
    isLoading,
    isEditing, 
    setIsEditing,
    saveConfig,
    handleLogoUpload,
    cancelEditing
  };
};

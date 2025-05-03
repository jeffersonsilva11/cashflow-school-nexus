
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock, PencilLine, Save, Settings, UploadCloud } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

// Define schema for general configuration
const generalConfigSchema = z.object({
  company_name: z.string().min(3, "Nome da empresa deve ter pelo menos 3 caracteres"),
  logo_url: z.string().optional(),
  timezone: z.string().default("America/Sao_Paulo"),
  date_format: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]).default("DD/MM/YYYY"),
  time_format: z.enum(["24h", "12h"]).default("24h"),
  default_currency: z.string().default("BRL"),
  support_email: z.string().email("Email inválido").optional().or(z.literal('')),
  support_phone: z.string().optional(),
  terms_url: z.string().url("URL inválida").optional().or(z.literal('')),
  privacy_url: z.string().url("URL inválida").optional().or(z.literal('')),
});

type GeneralConfig = z.infer<typeof generalConfigSchema>;

const GeneralSettings = () => {
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
      return data;
    },
  });
  
  // Setup form
  const form = useForm<GeneralConfig>({
    resolver: zodResolver(generalConfigSchema),
    defaultValues: {
      company_name: generalConfig?.company_name || 'Cashflow School Nexus',
      logo_url: generalConfig?.logo_url || '',
      timezone: generalConfig?.timezone || 'America/Sao_Paulo',
      date_format: (generalConfig?.date_format as any) || 'DD/MM/YYYY',
      time_format: (generalConfig?.time_format as any) || '24h',
      default_currency: generalConfig?.default_currency || 'BRL',
      support_email: generalConfig?.support_email || '',
      support_phone: generalConfig?.support_phone || '',
      terms_url: generalConfig?.terms_url || '',
      privacy_url: generalConfig?.privacy_url || '',
    },
  });
  
  // Update form values when data is loaded
  React.useEffect(() => {
    if (generalConfig) {
      form.reset({
        company_name: generalConfig.company_name || 'Cashflow School Nexus',
        logo_url: generalConfig.logo_url || '',
        timezone: generalConfig.timezone || 'America/Sao_Paulo',
        date_format: (generalConfig.date_format as any) || 'DD/MM/YYYY',
        time_format: (generalConfig.time_format as any) || '24h',
        default_currency: generalConfig.default_currency || 'BRL',
        support_email: generalConfig.support_email || '',
        support_phone: generalConfig.support_phone || '',
        terms_url: generalConfig.terms_url || '',
        privacy_url: generalConfig.privacy_url || '',
      });
    }
  }, [generalConfig, form.reset]);
  
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
      
      // Update form with simulated URL
      form.setValue('logo_url', `https://example.com/${fileName}`);
      
      toast.success('Logo enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar logo:', error);
      toast.error('Erro ao enviar logo');
    }
  };
  
  const timezones = [
    { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
    { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
    { value: 'America/Belem', label: 'Belém (GMT-3)' },
    { value: 'America/Bahia', label: 'Bahia (GMT-3)' },
    { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
    { value: 'America/Recife', label: 'Recife (GMT-3)' },
    { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
    { value: 'America/Campo_Grande', label: 'Campo Grande (GMT-4)' },
  ];
  
  const currencies = [
    { value: 'BRL', label: 'Real Brasileiro (R$)' },
    { value: 'USD', label: 'Dólar Americano ($)' },
    { value: 'EUR', label: 'Euro (€)' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Configurações Gerais
        </CardTitle>
        <CardDescription>
          Configurações básicas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Informações Gerais</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <PencilLine className="mr-1 h-4 w-4" />
              Editar
            </Button>
          </div>
          
          <Separator />
          
          {isLoading ? (
            <div>Carregando configurações...</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(saveConfig)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nome da sua empresa"
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome da empresa que aparecerá no sistema
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo da Empresa</FormLabel>
                      <div className="flex gap-4 items-center">
                        {field.value && (
                          <div className="w-16 h-16 border rounded flex items-center justify-center overflow-hidden">
                            <img 
                              src={field.value} 
                              alt="Logo" 
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="URL do logo"
                              disabled={!isEditing}
                            />
                          </FormControl>
                        </div>
                        {isEditing && (
                          <div>
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="relative"
                              disabled={!isEditing}
                            >
                              <UploadCloud className="h-4 w-4 mr-2" />
                              Enviar Logo
                              <Input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={!isEditing}
                              />
                            </Button>
                          </div>
                        )}
                      </div>
                      <FormDescription>
                        Logo que será exibido no cabeçalho e documentos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuso Horário</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o fuso horário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timezones.map((timezone) => (
                              <SelectItem key={timezone.value} value={timezone.value}>
                                {timezone.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Fuso horário usado para exibir datas e horas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="default_currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moeda Padrão</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a moeda padrão" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Moeda padrão usada em transações financeiras
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date_format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato de Data</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o formato de data" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Formato para exibição de datas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time_format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formato de Hora</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o formato de hora" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="24h">24 horas</SelectItem>
                            <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Formato para exibição de horários
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-2">Suporte e Links Legais</h3>
                <Separator className="mb-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="support_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Suporte</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="suporte@exemplo.com"
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormDescription>
                          Email exibido para contato de suporte
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="support_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone de Suporte</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="(00) 0000-0000"
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormDescription>
                          Telefone exibido para contato de suporte
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="terms_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL dos Termos de Uso</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://seu-site.com/termos"
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormDescription>
                          Link para os termos de uso do sistema
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="privacy_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Política de Privacidade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://seu-site.com/privacidade"
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormDescription>
                          Link para a política de privacidade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {isEditing && (
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Configurações
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <p>Última atualização: {generalConfig?.updated_at ? new Date(generalConfig.updated_at).toLocaleString() : 'Nunca'}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeneralSettings;

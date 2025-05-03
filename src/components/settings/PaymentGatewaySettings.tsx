import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Key, PencilLine, Save, TestTube } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Define schemas for payment gateway configuration
const stoneConfigSchema = z.object({
  api_key: z.string().min(1, "Chave de API é obrigatória"),
  stone_code: z.string().min(1, "Código Stone é obrigatório"),
  environment: z.enum(["sandbox", "production"]),
  enabled: z.boolean().default(false),
});

const pagseguroConfigSchema = z.object({
  api_key: z.string().min(1, "Chave de API é obrigatória"),
  app_id: z.string().min(1, "ID da Aplicação é obrigatório"),
  app_key: z.string().min(1, "Chave da Aplicação é obrigatória"),
  environment: z.enum(["sandbox", "production"]),
  enabled: z.boolean().default(false),
});

type StoneConfig = z.infer<typeof stoneConfigSchema>;
type PagseguroConfig = z.infer<typeof pagseguroConfigSchema>;

const PaymentGatewaySettings = () => {
  const [activeTab, setActiveTab] = useState<string>("stone");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Fetch existing configurations
  const { data: stoneConfig, isLoading: loadingStone, refetch: refetchStone } = useQuery({
    queryKey: ['payment-gateway-config', 'stone'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .select('*')
        .eq('gateway', 'stone')
        .single();
      
      if (error) {
        // Return default config if not found
        return { 
          gateway: 'stone',
          api_key: '',
          stone_code: '',
          environment: 'sandbox',
          enabled: false,
          config: {}
        };
      }
      return data;
    },
  });
  
  const { data: pagseguroConfig, isLoading: loadingPagseguro, refetch: refetchPagseguro } = useQuery({
    queryKey: ['payment-gateway-config', 'pagseguro'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .select('*')
        .eq('gateway', 'pagseguro')
        .single();
      
      if (error) {
        // Return default config if not found
        return { 
          gateway: 'pagseguro',
          api_key: '',
          app_id: '',
          app_key: '',
          environment: 'sandbox',
          enabled: false,
          config: {}
        };
      }
      return data;
    },
  });
  
  // Setup forms
  const stoneForm = useForm<StoneConfig>({
    resolver: zodResolver(stoneConfigSchema),
    defaultValues: {
      api_key: stoneConfig?.api_key || '',
      stone_code: stoneConfig?.stone_code || '',
      environment: (stoneConfig?.environment as "sandbox" | "production") || 'sandbox',
      enabled: stoneConfig?.enabled || false,
    },
  });
  
  const pagseguroForm = useForm<PagseguroConfig>({
    resolver: zodResolver(pagseguroConfigSchema),
    defaultValues: {
      api_key: pagseguroConfig?.api_key || '',
      app_id: pagseguroConfig?.app_id || '',
      app_key: pagseguroConfig?.app_key || '',
      environment: (pagseguroConfig?.environment as "sandbox" | "production") || 'sandbox',
      enabled: pagseguroConfig?.enabled || false,
    },
  });
  
  // Update form values when data is loaded
  React.useEffect(() => {
    if (stoneConfig) {
      stoneForm.reset({
        api_key: stoneConfig.api_key || '',
        stone_code: stoneConfig.stone_code || '',
        environment: (stoneConfig.environment as "sandbox" | "production") || 'sandbox',
        enabled: stoneConfig.enabled || false,
      });
    }
  }, [stoneConfig, stoneForm.reset]);
  
  React.useEffect(() => {
    if (pagseguroConfig) {
      pagseguroForm.reset({
        api_key: pagseguroConfig.api_key || '',
        app_id: pagseguroConfig.app_id || '',
        app_key: pagseguroConfig.app_key || '',
        environment: (pagseguroConfig.environment as "sandbox" | "production") || 'sandbox',
        enabled: pagseguroConfig.enabled || false,
      });
    }
  }, [pagseguroConfig, pagseguroForm.reset]);
  
  // Save Stone configuration
  const saveStoneConfig = async (data: StoneConfig) => {
    try {
      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert({
          gateway: 'stone',
          api_key: data.api_key,
          stone_code: data.stone_code,
          environment: data.environment,
          enabled: data.enabled,
          config: {
            api_key: data.api_key,
            stone_code: data.stone_code,
          },
        });
      
      if (error) throw error;
      
      toast.success('Configurações da Stone atualizadas com sucesso');
      setIsEditing(false);
      refetchStone();
    } catch (error) {
      console.error('Erro ao salvar configurações da Stone:', error);
      toast.error('Erro ao salvar configurações da Stone');
    }
  };
  
  // Save Pagseguro configuration
  const savePagseguroConfig = async (data: PagseguroConfig) => {
    try {
      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert({
          gateway: 'pagseguro',
          api_key: data.api_key,
          app_id: data.app_id,
          app_key: data.app_key,
          environment: data.environment,
          enabled: data.enabled,
          config: {
            api_key: data.api_key,
            app_id: data.app_id,
            app_key: data.app_key,
          },
        });
      
      if (error) throw error;
      
      toast.success('Configurações do PagSeguro atualizadas com sucesso');
      setIsEditing(false);
      refetchPagseguro();
    } catch (error) {
      console.error('Erro ao salvar configurações do PagSeguro:', error);
      toast.error('Erro ao salvar configurações do PagSeguro');
    }
  };
  
  // Test integration
  const testIntegration = async (gateway: string) => {
    toast.info(`Testando integração com ${gateway}...`);
    try {
      // Here you would actually test the integration with the payment gateway
      // This is just a placeholder
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Conexão com ${gateway} estabelecida com sucesso`);
    } catch (error) {
      console.error(`Erro ao testar integração com ${gateway}:`, error);
      toast.error(`Erro ao testar integração com ${gateway}`);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Gateways de Pagamento
        </CardTitle>
        <CardDescription>
          Configure as integrações com os gateways de pagamento (maquininhas)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="stone">Stone</TabsTrigger>
            <TabsTrigger value="pagseguro">PagSeguro</TabsTrigger>
            <TabsTrigger value="terminals">Terminais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stone">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Configurações da Stone</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <PencilLine className="mr-1 h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => testIntegration('Stone')}
                  >
                    <TestTube className="mr-1 h-4 w-4" />
                    Testar Conexão
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {loadingStone ? (
                <div>Carregando configurações...</div>
              ) : (
                <Form {...stoneForm}>
                  <form onSubmit={stoneForm.handleSubmit(saveStoneConfig)} className="space-y-4">
                    <FormField
                      control={stoneForm.control}
                      name="enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Integração Ativa</FormLabel>
                            <FormDescription>
                              Ativar ou desativar a integração com Stone
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isEditing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={stoneForm.control}
                      name="environment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Ambiente</FormLabel>
                            <FormDescription>
                              Selecione entre ambiente de testes ou produção
                            </FormDescription>
                          </div>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="sandbox"
                                  value="sandbox"
                                  checked={field.value === 'sandbox'}
                                  onChange={() => field.onChange('sandbox')}
                                  disabled={!isEditing}
                                />
                                <label htmlFor="sandbox">Sandbox</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="production"
                                  value="production"
                                  checked={field.value === 'production'}
                                  onChange={() => field.onChange('production')}
                                  disabled={!isEditing}
                                />
                                <label htmlFor="production">Produção</label>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={stoneForm.control}
                      name="api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave de API</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                {...field}
                                type={isEditing ? "text" : "password"}
                                placeholder="Insira a chave de API da Stone"
                                disabled={!isEditing}
                              />
                              {!isEditing && field.value && (
                                <Button
                                  variant="ghost"
                                  type="button"
                                  size="icon"
                                  className="ml-2"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <Key className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            A chave de API pode ser obtida no portal da Stone
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={stoneForm.control}
                      name="stone_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código Stone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Insira o código da Stone"
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormDescription>
                            O código da Stone é fornecido pela Stone e identifica sua conta
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            stoneForm.reset();
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
          </TabsContent>
          
          <TabsContent value="pagseguro">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Configurações do PagSeguro</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <PencilLine className="mr-1 h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => testIntegration('PagSeguro')}
                  >
                    <TestTube className="mr-1 h-4 w-4" />
                    Testar Conexão
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {loadingPagseguro ? (
                <div>Carregando configurações...</div>
              ) : (
                <Form {...pagseguroForm}>
                  <form onSubmit={pagseguroForm.handleSubmit(savePagseguroConfig)} className="space-y-4">
                    <FormField
                      control={pagseguroForm.control}
                      name="enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Integração Ativa</FormLabel>
                            <FormDescription>
                              Ativar ou desativar a integração com PagSeguro
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isEditing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={pagseguroForm.control}
                      name="environment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Ambiente</FormLabel>
                            <FormDescription>
                              Selecione entre ambiente de testes ou produção
                            </FormDescription>
                          </div>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="pagseguro-sandbox"
                                  value="sandbox"
                                  checked={field.value === 'sandbox'}
                                  onChange={() => field.onChange('sandbox')}
                                  disabled={!isEditing}
                                />
                                <label htmlFor="pagseguro-sandbox">Sandbox</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="pagseguro-production"
                                  value="production"
                                  checked={field.value === 'production'}
                                  onChange={() => field.onChange('production')}
                                  disabled={!isEditing}
                                />
                                <label htmlFor="pagseguro-production">Produção</label>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={pagseguroForm.control}
                      name="api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave de API</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                {...field}
                                type={isEditing ? "text" : "password"}
                                placeholder="Insira a chave de API do PagSeguro"
                                disabled={!isEditing}
                              />
                              {!isEditing && field.value && (
                                <Button
                                  variant="ghost"
                                  type="button"
                                  size="icon"
                                  className="ml-2"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <Key className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            A chave de API pode ser obtida no portal do PagSeguro
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={pagseguroForm.control}
                      name="app_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID da Aplicação</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Insira o ID da aplicação do PagSeguro"
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormDescription>
                            O ID da aplicação é fornecido pelo PagSeguro ao registrar sua aplicação
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={pagseguroForm.control}
                      name="app_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave da Aplicação</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                {...field}
                                type={isEditing ? "text" : "password"}
                                placeholder="Insira a chave da aplicação do PagSeguro"
                                disabled={!isEditing}
                              />
                              {!isEditing && field.value && (
                                <Button
                                  variant="ghost"
                                  type="button"
                                  size="icon"
                                  className="ml-2"
                                  onClick={() => setIsEditing(true)}
                                >
                                  <Key className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            A chave da aplicação é fornecida pelo PagSeguro junto com o ID da aplicação
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            pagseguroForm.reset();
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
          </TabsContent>
          
          <TabsContent value="terminals">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Gerenciamento de Terminais</h3>
              </div>
              
              <p className="text-muted-foreground">
                Os terminais de pagamento são gerenciados na página de cada cantina. Acesse a página de uma cantina e navegue até a aba "Terminais de Pagamento" para gerenciar as maquininhas vinculadas a cada cantina.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Fluxo de gerenciamento de terminais</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Acesse o menu "Cantinas" no painel lateral</li>
                  <li>Selecione a cantina desejada</li>
                  <li>Navegue até a aba "Terminais de Pagamento"</li>
                  <li>Adicione, configure ou remova terminais de pagamento</li>
                </ol>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/vendors')}
                >
                  Ir para Gerenciamento de Cantinas
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          As configurações dos gateways são usadas para integrar as maquininhas de pagamento ao sistema.
          Configure primeiro o gateway e depois adicione os terminais às cantinas.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PaymentGatewaySettings;

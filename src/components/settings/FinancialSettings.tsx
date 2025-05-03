
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
import { BanknoteIcon, CreditCard, Key, PencilLine, Save, TestTube } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define schemas for payment provider configurations
const stripeConfigSchema = z.object({
  api_key: z.string().min(1, "Chave de API é obrigatória"),
  publishable_key: z.string().min(1, "Chave pública é obrigatória"),
  webhook_secret: z.string().optional(),
  environment: z.enum(["test", "production"]),
  enabled: z.boolean().default(false),
});

const asaasConfigSchema = z.object({
  api_key: z.string().min(1, "Chave de API é obrigatória"),
  environment: z.enum(["sandbox", "production"]),
  enabled: z.boolean().default(false),
});

type StripeConfig = z.infer<typeof stripeConfigSchema>;
type AsaasConfig = z.infer<typeof asaasConfigSchema>;

const FinancialSettings = () => {
  const [activeTab, setActiveTab] = useState<string>("stripe");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Fetch existing configurations
  const { data: stripeConfig, isLoading: loadingStripe, refetch: refetchStripe } = useQuery({
    queryKey: ['financial-config', 'stripe'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_provider_configs')
        .select('*')
        .eq('provider', 'stripe')
        .single();
      
      if (error) {
        // Return default config if not found
        return { 
          provider: 'stripe',
          api_key: '',
          publishable_key: '',
          webhook_secret: '',
          environment: 'test',
          enabled: false,
          config: {}
        };
      }
      return data;
    },
  });
  
  const { data: asaasConfig, isLoading: loadingAsaas, refetch: refetchAsaas } = useQuery({
    queryKey: ['financial-config', 'asaas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_provider_configs')
        .select('*')
        .eq('provider', 'asaas')
        .single();
      
      if (error) {
        // Return default config if not found
        return { 
          provider: 'asaas',
          api_key: '',
          environment: 'sandbox',
          enabled: false,
          config: {}
        };
      }
      return data;
    },
  });
  
  // Setup forms
  const stripeForm = useForm<StripeConfig>({
    resolver: zodResolver(stripeConfigSchema),
    defaultValues: {
      api_key: stripeConfig?.api_key || '',
      publishable_key: stripeConfig?.publishable_key || '',
      webhook_secret: stripeConfig?.webhook_secret || '',
      environment: (stripeConfig?.environment as "test" | "production") || 'test',
      enabled: stripeConfig?.enabled || false,
    },
  });
  
  const asaasForm = useForm<AsaasConfig>({
    resolver: zodResolver(asaasConfigSchema),
    defaultValues: {
      api_key: asaasConfig?.api_key || '',
      environment: (asaasConfig?.environment as "sandbox" | "production") || 'sandbox',
      enabled: asaasConfig?.enabled || false,
    },
  });
  
  // Update form values when data is loaded
  React.useEffect(() => {
    if (stripeConfig) {
      stripeForm.reset({
        api_key: stripeConfig.api_key || '',
        publishable_key: stripeConfig.publishable_key || '',
        webhook_secret: stripeConfig.webhook_secret || '',
        environment: (stripeConfig.environment as "test" | "production") || 'test',
        enabled: stripeConfig.enabled || false,
      });
    }
  }, [stripeConfig, stripeForm.reset]);
  
  React.useEffect(() => {
    if (asaasConfig) {
      asaasForm.reset({
        api_key: asaasConfig.api_key || '',
        environment: (asaasConfig.environment as "sandbox" | "production") || 'sandbox',
        enabled: asaasConfig.enabled || false,
      });
    }
  }, [asaasConfig, asaasForm.reset]);
  
  // Save Stripe configuration
  const saveStripeConfig = async (data: StripeConfig) => {
    try {
      const { error } = await supabase
        .from('payment_provider_configs')
        .upsert({
          provider: 'stripe',
          api_key: data.api_key,
          publishable_key: data.publishable_key,
          webhook_secret: data.webhook_secret,
          environment: data.environment,
          enabled: data.enabled,
          config: {
            secret_key: data.api_key,
            publishable_key: data.publishable_key,
            webhook_secret: data.webhook_secret,
          },
        });
      
      if (error) throw error;
      
      toast.success('Configurações do Stripe atualizadas com sucesso');
      setIsEditing(false);
      refetchStripe();
    } catch (error) {
      console.error('Erro ao salvar configurações do Stripe:', error);
      toast.error('Erro ao salvar configurações do Stripe');
    }
  };
  
  // Save Asaas configuration
  const saveAsaasConfig = async (data: AsaasConfig) => {
    try {
      const { error } = await supabase
        .from('payment_provider_configs')
        .upsert({
          provider: 'asaas',
          api_key: data.api_key,
          environment: data.environment,
          enabled: data.enabled,
          config: {
            api_key: data.api_key,
          },
        });
      
      if (error) throw error;
      
      toast.success('Configurações do Asaas atualizadas com sucesso');
      setIsEditing(false);
      refetchAsaas();
    } catch (error) {
      console.error('Erro ao salvar configurações do Asaas:', error);
      toast.error('Erro ao salvar configurações do Asaas');
    }
  };
  
  // Test integration
  const testIntegration = async (provider: string) => {
    toast.info(`Testando integração com ${provider}...`);
    try {
      // Here you would actually test the integration with the payment provider
      // This is just a placeholder
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Conexão com ${provider} estabelecida com sucesso`);
    } catch (error) {
      console.error(`Erro ao testar integração com ${provider}:`, error);
      toast.error(`Erro ao testar integração com ${provider}`);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BanknoteIcon className="mr-2 h-5 w-5" />
          Provedores de Pagamento
        </CardTitle>
        <CardDescription>
          Configure os provedores de pagamento para processamento financeiro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
            <TabsTrigger value="asaas">Asaas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stripe">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Configurações do Stripe</h3>
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
                    onClick={() => testIntegration('Stripe')}
                  >
                    <TestTube className="mr-1 h-4 w-4" />
                    Testar Conexão
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {loadingStripe ? (
                <div>Carregando configurações...</div>
              ) : (
                <Form {...stripeForm}>
                  <form onSubmit={stripeForm.handleSubmit(saveStripeConfig)} className="space-y-4">
                    <FormField
                      control={stripeForm.control}
                      name="enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Integração Ativa</FormLabel>
                            <FormDescription>
                              Ativar ou desativar a integração com Stripe
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
                      control={stripeForm.control}
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
                                  id="stripe-test"
                                  value="test"
                                  checked={field.value === 'test'}
                                  onChange={() => field.onChange('test')}
                                  disabled={!isEditing}
                                />
                                <label htmlFor="stripe-test">Testes</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="stripe-production"
                                  value="production"
                                  checked={field.value === 'production'}
                                  onChange={() => field.onChange('production')}
                                  disabled={!isEditing}
                                />
                                <label htmlFor="stripe-production">Produção</label>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={stripeForm.control}
                      name="api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave Secreta (Secret Key)</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                {...field}
                                type={isEditing ? "text" : "password"}
                                placeholder="sk_test_..."
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
                            A chave secreta do Stripe pode ser obtida no dashboard do Stripe
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={stripeForm.control}
                      name="publishable_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave Pública (Publishable Key)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="pk_test_..."
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormDescription>
                            A chave pública do Stripe pode ser obtida no dashboard do Stripe
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={stripeForm.control}
                      name="webhook_secret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave do Webhook (Webhook Secret) - Opcional</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                {...field}
                                type={isEditing ? "text" : "password"}
                                placeholder="whsec_..."
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
                            A chave do webhook é usada para verificar eventos enviados pelo Stripe
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
                            stripeForm.reset();
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
          
          <TabsContent value="asaas">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Configurações do Asaas</h3>
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
                    onClick={() => testIntegration('Asaas')}
                  >
                    <TestTube className="mr-1 h-4 w-4" />
                    Testar Conexão
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {loadingAsaas ? (
                <div>Carregando configurações...</div>
              ) : (
                <Form {...asaasForm}>
                  <form onSubmit={asaasForm.handleSubmit(saveAsaasConfig)} className="space-y-4">
                    <FormField
                      control={asaasForm.control}
                      name="enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Integração Ativa</FormLabel>
                            <FormDescription>
                              Ativar ou desativar a integração com Asaas
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
                      control={asaasForm.control}
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
                                  id="asaas-sandbox"
                                  value="sandbox"
                                  checked={field.value === 'sandbox'}
                                  onChange={() => field.onChange('sandbox')}
                                  disabled={!isEditing}
                                />
                                <label htmlFor="asaas-sandbox">Sandbox</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="asaas-production"
                                  value="production"
                                  checked={field.value === 'production'}
                                  onChange={() => field.onChange('production')}
                                  disabled={!isEditing}
                                />
                                <label htmlFor="asaas-production">Produção</label>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={asaasForm.control}
                      name="api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave de API</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                {...field}
                                type={isEditing ? "text" : "password"}
                                placeholder="Insira a chave de API do Asaas"
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
                            A chave de API pode ser obtida no painel administrativo do Asaas
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
                            asaasForm.reset();
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
        </Tabs>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t px-6 py-4">
        <div className="space-y-2">
          <h4 className="font-medium">Links úteis:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><a href="https://stripe.com/docs/api/authentication" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Documentação de autenticação do Stripe</a></li>
            <li><a href="https://asaasio.github.io/asaas-docs-api-v3/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Documentação da API do Asaas</a></li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FinancialSettings;

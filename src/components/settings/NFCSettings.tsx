
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
import { CreditCard, Key, PencilLine, Save, Smartphone } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define schema for NFC configuration
const nfcConfigSchema = z.object({
  buffer_time: z.coerce.number().int().min(500, "Buffer mínimo de 500ms").max(5000, "Buffer máximo de 5000ms"),
  auto_read: z.boolean().default(true),
  debug_mode: z.boolean().default(false),
  card_protocols: z.array(z.string()).default(['IsoDep', 'NfcA', 'MifareClassic']),
  enabled: z.boolean().default(true),
});

type NFCConfig = z.infer<typeof nfcConfigSchema>;

const NFCSettings = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Fetch existing configuration
  const { data: nfcConfig, isLoading, refetch } = useQuery({
    queryKey: ['nfc-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configs')
        .select('*')
        .eq('config_key', 'nfc')
        .single();
      
      if (error) {
        // Return default config if not found
        return { 
          config_key: 'nfc',
          buffer_time: 1000,
          auto_read: true,
          debug_mode: false,
          card_protocols: ['IsoDep', 'NfcA', 'MifareClassic'],
          enabled: true,
          config: {}
        };
      }
      return data;
    },
  });
  
  // Setup form
  const form = useForm<NFCConfig>({
    resolver: zodResolver(nfcConfigSchema),
    defaultValues: {
      buffer_time: nfcConfig?.buffer_time || 1000,
      auto_read: nfcConfig?.auto_read ?? true,
      debug_mode: nfcConfig?.debug_mode || false,
      card_protocols: nfcConfig?.card_protocols || ['IsoDep', 'NfcA', 'MifareClassic'],
      enabled: nfcConfig?.enabled ?? true,
    },
  });
  
  // Update form values when data is loaded
  React.useEffect(() => {
    if (nfcConfig) {
      form.reset({
        buffer_time: nfcConfig.buffer_time || 1000,
        auto_read: nfcConfig.auto_read ?? true,
        debug_mode: nfcConfig.debug_mode || false,
        card_protocols: nfcConfig.card_protocols || ['IsoDep', 'NfcA', 'MifareClassic'],
        enabled: nfcConfig.enabled ?? true,
      });
    }
  }, [nfcConfig, form.reset]);
  
  // Save configuration
  const saveConfig = async (data: NFCConfig) => {
    try {
      const { error } = await supabase
        .from('system_configs')
        .upsert({
          config_key: 'nfc',
          buffer_time: data.buffer_time,
          auto_read: data.auto_read,
          debug_mode: data.debug_mode,
          card_protocols: data.card_protocols,
          enabled: data.enabled,
          config: {
            buffer_time: data.buffer_time,
            auto_read: data.auto_read,
            debug_mode: data.debug_mode,
            card_protocols: data.card_protocols,
          },
        });
      
      if (error) throw error;
      
      toast.success('Configurações de NFC atualizadas com sucesso');
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Erro ao salvar configurações de NFC:', error);
      toast.error('Erro ao salvar configurações de NFC');
    }
  };
  
  const availableProtocols = [
    { value: 'IsoDep', label: 'ISO-DEP' },
    { value: 'NfcA', label: 'NFC-A' },
    { value: 'NfcB', label: 'NFC-B' },
    { value: 'NfcF', label: 'NFC-F' },
    { value: 'NfcV', label: 'NFC-V' },
    { value: 'MifareClassic', label: 'Mifare Classic' },
    { value: 'MifareUltralight', label: 'Mifare Ultralight' },
  ];
  
  const toggleProtocol = (protocol: string) => {
    const currentProtocols = form.getValues('card_protocols');
    const updatedProtocols = currentProtocols.includes(protocol)
      ? currentProtocols.filter(p => p !== protocol)
      : [...currentProtocols, protocol];
    
    form.setValue('card_protocols', updatedProtocols);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smartphone className="mr-2 h-5 w-5" />
          Configurações NFC
        </CardTitle>
        <CardDescription>
          Configure os parâmetros para leitura e processamento de cartões NFC
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Configurações de Leitura NFC</h3>
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
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Funcionalidade NFC Ativa</FormLabel>
                        <FormDescription>
                          Ativar ou desativar a funcionalidade de leitura NFC
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
                  control={form.control}
                  name="auto_read"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Leitura Automática</FormLabel>
                        <FormDescription>
                          Ativar leitura automática quando um cartão for detectado
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
                  control={form.control}
                  name="debug_mode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Modo Debug</FormLabel>
                        <FormDescription>
                          Ativar logs detalhados para depuração de problemas com NFC
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
                  control={form.control}
                  name="buffer_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Buffer (ms)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="500"
                          max="5000"
                          step="100"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormDescription>
                        Tempo mínimo entre leituras consecutivas para evitar duplicações (500-5000ms)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="card_protocols"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protocolos de Cartão</FormLabel>
                      <FormDescription>
                        Selecione os tipos de cartão NFC que o sistema deve detectar
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {availableProtocols.map((protocol) => (
                          <div 
                            key={protocol.value} 
                            className={`
                              flex items-center rounded-md border p-2 cursor-pointer
                              ${field.value.includes(protocol.value) ? 'bg-primary/10 border-primary' : 'bg-transparent'}
                            `}
                            onClick={() => {
                              if (isEditing) toggleProtocol(protocol.value);
                            }}
                          >
                            <input
                              type="checkbox"
                              id={`protocol-${protocol.value}`}
                              checked={field.value.includes(protocol.value)}
                              onChange={() => {}}
                              className="mr-2"
                              disabled={!isEditing}
                            />
                            <label 
                              htmlFor={`protocol-${protocol.value}`}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {protocol.label}
                            </label>
                          </div>
                        ))}
                      </div>
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
        <div className="space-y-2">
          <h4 className="font-medium">Notas sobre NFC:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>O suporte a NFC requer dispositivos com hardware compatível</li>
            <li>Nem todos os modelos de cartão são compatíveis com todos os protocolos</li>
            <li>Recomendamos manter habilitados apenas os protocolos que você realmente utiliza</li>
            <li>O modo debug aumenta o consumo de recursos e deve ser utilizado apenas para solução de problemas</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NFCSettings;

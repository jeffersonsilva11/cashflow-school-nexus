
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
import { Globe, Key, PencilLine, Save, TestTube } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define schema for map configuration
const mapConfigSchema = z.object({
  mapbox_token: z.string().min(1, "Token do Mapbox é obrigatório"),
  map_style: z.enum(["basic", "streets", "outdoors", "light", "dark", "satellite"]),
  enabled: z.boolean().default(false),
});

type MapConfig = z.infer<typeof mapConfigSchema>;

const MapSettings = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Fetch existing configuration
  const { data: mapConfig, isLoading, refetch } = useQuery({
    queryKey: ['map-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configs')
        .select('*')
        .eq('config_key', 'mapbox')
        .single();
      
      if (error) {
        // Return default config if not found
        return { 
          config_key: 'mapbox',
          mapbox_token: '',
          map_style: 'streets',
          enabled: false,
          config: {}
        };
      }
      return data;
    },
  });
  
  // Setup form
  const form = useForm<MapConfig>({
    resolver: zodResolver(mapConfigSchema),
    defaultValues: {
      mapbox_token: mapConfig?.mapbox_token || '',
      map_style: (mapConfig?.map_style as any) || 'streets',
      enabled: mapConfig?.enabled || false,
    },
  });
  
  // Update form values when data is loaded
  React.useEffect(() => {
    if (mapConfig) {
      form.reset({
        mapbox_token: mapConfig.mapbox_token || '',
        map_style: (mapConfig.map_style as any) || 'streets',
        enabled: mapConfig.enabled || false,
      });
    }
  }, [mapConfig, form.reset]);
  
  // Save configuration
  const saveConfig = async (data: MapConfig) => {
    try {
      const { error } = await supabase
        .from('system_configs')
        .upsert({
          config_key: 'mapbox',
          mapbox_token: data.mapbox_token,
          map_style: data.map_style,
          enabled: data.enabled,
          config: {
            token: data.mapbox_token,
            style: data.map_style,
          },
        });
      
      if (error) throw error;
      
      toast.success('Configurações do Mapbox atualizadas com sucesso');
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Erro ao salvar configurações do Mapbox:', error);
      toast.error('Erro ao salvar configurações do Mapbox');
    }
  };
  
  // Test integration
  const testIntegration = async () => {
    const token = form.getValues('mapbox_token');
    
    if (!token) {
      toast.error('Token do Mapbox não configurado');
      return;
    }
    
    toast.info('Testando integração com o Mapbox...');
    try {
      // Here you would actually test the integration with Mapbox
      // This is just a placeholder
      const response = await fetch(`https://api.mapbox.com/tokens/v2?access_token=${token}`);
      
      if (!response.ok) {
        throw new Error(`Erro na conexão: ${response.status}`);
      }
      
      toast.success('Conexão com Mapbox estabelecida com sucesso');
    } catch (error) {
      console.error('Erro ao testar integração com Mapbox:', error);
      toast.error('Erro ao testar integração com Mapbox');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Configurações de Mapas
        </CardTitle>
        <CardDescription>
          Configure a integração com o Mapbox para recursos de mapeamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Configurações do Mapbox</h3>
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
                onClick={testIntegration}
              >
                <TestTube className="mr-1 h-4 w-4" />
                Testar Conexão
              </Button>
            </div>
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
                        <FormLabel>Integração Ativa</FormLabel>
                        <FormDescription>
                          Ativar ou desativar a integração com Mapbox
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
                  name="mapbox_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token do Mapbox</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            {...field}
                            type={isEditing ? "text" : "password"}
                            placeholder="Insira o token de acesso do Mapbox"
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
                        O token de acesso público do Mapbox pode ser obtido no dashboard do Mapbox
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="map_style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estilo do Mapa</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estilo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Básico</SelectItem>
                          <SelectItem value="streets">Ruas</SelectItem>
                          <SelectItem value="outdoors">Externo</SelectItem>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="satellite">Satélite</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        O estilo do mapa determina a aparência visual dos mapas
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
          <h4 className="font-medium">Como obter um token do Mapbox:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Crie uma conta em <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a></li>
            <li>Acesse o dashboard e navegue até a seção de tokens</li>
            <li>Crie um novo token público (public token) para sua aplicação</li>
            <li>Copie o token e cole no campo acima</li>
          </ol>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MapSettings;


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, UploadCloud } from "lucide-react";

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

export type GeneralConfig = z.infer<typeof generalConfigSchema>;

type GeneralSettingsFormProps = {
  defaultValues: GeneralConfig;
  isEditing: boolean;
  onSubmit: (data: GeneralConfig) => void;
  onCancel: () => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({
  defaultValues,
  isEditing,
  onSubmit,
  onCancel,
  onLogoUpload
}) => {
  // Setup form
  const form = useForm<GeneralConfig>({
    resolver: zodResolver(generalConfigSchema),
    defaultValues
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        onChange={onLogoUpload}
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
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                    <SelectItem value="America/Belem">Belém (GMT-3)</SelectItem>
                    <SelectItem value="America/Bahia">Bahia (GMT-3)</SelectItem>
                    <SelectItem value="America/Fortaleza">Fortaleza (GMT-3)</SelectItem>
                    <SelectItem value="America/Recife">Recife (GMT-3)</SelectItem>
                    <SelectItem value="America/Cuiaba">Cuiabá (GMT-4)</SelectItem>
                    <SelectItem value="America/Campo_Grande">Campo Grande (GMT-4)</SelectItem>
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
                    <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                    <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
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
              onClick={onCancel}
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
  );
};

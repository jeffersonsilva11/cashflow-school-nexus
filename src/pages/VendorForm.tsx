
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

// Esquema de validação com Zod
const vendorFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  type: z.enum(['own', 'third_party'], { 
    required_error: 'Selecione o tipo de cantina'
  }),
  school_id: z.string().uuid({ message: 'Selecione uma escola válida' }).optional(),
  location: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  commission_rate: z.coerce.number().min(0).max(100).optional(),
  payment_gateway: z.enum(['stone', 'pagseguro', 'other'], {
    required_error: 'Selecione uma gateway de pagamento'
  }).optional(),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

export default function VendorForm() {
  const navigate = useNavigate();
  
  // Fetch schools for dropdown
  const { data: schools } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
  
  // Default values for the form
  const defaultValues: Partial<VendorFormValues> = {
    type: 'third_party',
    commission_rate: 10,
    payment_gateway: 'stone',
  };

  // Initialize form
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Handle form submission
  const onSubmit = async (data: VendorFormValues) => {
    try {
      // Insert vendor data
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          name: data.name,
          type: data.type,
          school_id: data.school_id || null,
          location: data.location || null,
          contact_name: data.contact_name || null,
          contact_email: data.contact_email || null,
          contact_phone: data.contact_phone || null,
          commission_rate: data.commission_rate || 0,
          active: true,
        })
        .select('id')
        .single();

      if (vendorError) throw vendorError;

      // Initialize financials record for the vendor
      const { error: financialsError } = await supabase
        .from('vendors_financials')
        .insert({
          vendor_id: vendor.id,
          balance: 0,
          pending_transfer: 0,
          transfer_frequency: 'monthly',
        });

      if (financialsError) throw financialsError;

      // Show success message
      toast.success('Cantina cadastrada com sucesso!');
      
      // Navigate to the vendor details page
      navigate(`/vendors/${vendor.id}`);
    } catch (error: any) {
      console.error('Erro ao criar cantina:', error);
      toast.error('Erro ao cadastrar cantina: ' + (error.message || 'Erro desconhecido'));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/vendors')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Cantina</h1>
          <p className="text-muted-foreground">
            Cadastre uma nova cantina no sistema
          </p>
        </div>
      </div>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Dados da Cantina</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para cadastrar uma nova cantina.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Cantina</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da cantina" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cantina</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="third_party" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Cantina Terceirizada
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="own" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Cantina Própria
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="school_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escola</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma escola" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools?.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Escola à qual esta cantina está vinculada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Bloco A, 2º andar" {...field} />
                    </FormControl>
                    <FormDescription>
                      Localização da cantina dentro da escola (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-slate-50 p-4 rounded-md border">
                <h3 className="text-lg font-medium mb-4">Informações de Contato</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Contato</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              {form.watch('type') === 'third_party' && (
                <div className="bg-slate-50 p-4 rounded-md border">
                  <h3 className="text-lg font-medium mb-4">Configurações Financeiras</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="commission_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Taxa de Comissão (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" step="0.5" {...field} />
                          </FormControl>
                          <FormDescription>
                            Porcentagem que será retida como comissão sobre as vendas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="payment_gateway"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gateway de Pagamento Preferencial</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um gateway" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="stone">Stone</SelectItem>
                              <SelectItem value="pagseguro">PagSeguro</SelectItem>
                              <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Gateway de pagamento utilizado pela cantina
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/vendors')}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

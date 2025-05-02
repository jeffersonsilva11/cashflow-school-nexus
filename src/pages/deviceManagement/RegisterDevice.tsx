
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreditCard, Package, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  batchId: z.string({
    required_error: "Por favor, selecione um lote",
  }),
  serialNumber: z.string().optional(),
  uid: z.string().min(1, {
    message: "O UID do dispositivo é obrigatório",
  }),
  type: z.string({
    required_error: "Por favor, selecione o tipo de dispositivo",
  }),
  model: z.string().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterDevice() {
  const navigate = useNavigate();
  const [isNfcReading, setIsNfcReading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNumber: '',
      uid: '',
      model: '',
      color: '',
      notes: '',
    },
  });

  // Dados simulados de lotes
  const mockBatches = [
    { id: 'LOT-2023-05A', name: 'Lote Maio 2023 - Cartões' },
    { id: 'LOT-2023-06B', name: 'Lote Junho 2023 - Pulseiras' },
    { id: 'LOT-2023-08C', name: 'Lote Agosto 2023 - Cartões Premium' },
  ];

  // Função simulada para leitura de NFC
  const handleNfcRead = () => {
    setIsNfcReading(true);
    
    // Simulação de leitura NFC após 2 segundos
    setTimeout(() => {
      const mockUid = '04:' + Math.random().toString(16).slice(2, 10).toUpperCase();
      form.setValue('uid', mockUid);
      setIsNfcReading(false);
      toast.success("Dispositivo NFC lido com sucesso!", {
        description: `UID: ${mockUid}`,
      });
    }, 2000);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast.success("Dispositivo cadastrado com sucesso!", {
      description: `O dispositivo ${data.serialNumber || data.uid} foi cadastrado.`,
    });
    
    setTimeout(() => {
      navigate('/devices');
    }, 1500);
  };

  const batchChangeHandler = (value: string) => {
    const batch = mockBatches.find(b => b.id === value);
    const isCard = batch?.name.toLowerCase().includes('cartão') || false;
    form.setValue('type', isCard ? 'card' : 'wristband');
    
    // Gerar número de série baseado no lote
    const serialBase = isCard ? 'CARD-' : 'WB-';
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    form.setValue('serialNumber', `${serialBase}${randomSuffix}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/devices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cadastro Individual de Dispositivo</h1>
            <p className="text-muted-foreground">Cadastre um novo dispositivo no sistema</p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações do Dispositivo</CardTitle>
          <CardDescription>Preencha os dados para cadastrar um novo cartão ou pulseira</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="batchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lote</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            batchChangeHandler(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um lote" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockBatches.map((batch) => (
                              <SelectItem key={batch.id} value={batch.id}>
                                {batch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Selecione o lote ao qual este dispositivo pertence
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Série</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Será gerado automaticamente" />
                        </FormControl>
                        <FormDescription>
                          O número de série é gerado com base no lote selecionado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Dispositivo</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="card">Cartão</SelectItem>
                            <SelectItem value="wristband">Pulseira</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Tipo de dispositivo a ser cadastrado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-900">
                    <h3 className="font-medium text-lg mb-4">Leitura do Dispositivo NFC</h3>
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-primary/10 relative">
                        <CreditCard className="h-12 w-12 text-primary" />
                        {isNfcReading && (
                          <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-primary" />
                        )}
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="uid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UID do Dispositivo</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input {...field} placeholder="04:A3:F2:11:3E..." />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline"
                              disabled={isNfcReading}
                              onClick={handleNfcRead}
                            >
                              Ler
                            </Button>
                          </div>
                          <FormDescription>
                            Identificador único do dispositivo NFC
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium text-lg mb-4">Informações Adicionais</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Modelo do dispositivo (opcional)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cor</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Cor do dispositivo (opcional)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <textarea
                        className="min-h-[80px] w-full rounded-md border border-input p-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        placeholder="Observações adicionais sobre este dispositivo (opcional)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => navigate('/devices')}>
                  Cancelar
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Cadastrar Dispositivo
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

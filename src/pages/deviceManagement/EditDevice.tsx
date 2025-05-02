
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, Save, CreditCard, Lock, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Esquema de formulário para edição de dispositivo
const formSchema = z.object({
  status: z.string(),
  type: z.string(),
  model: z.string().optional(),
  serial: z.string(),
  uid: z.string(),
  batchId: z.string(),
  enablePayments: z.boolean().default(true),
  enableAccess: z.boolean().default(true),
  enableIdentification: z.boolean().default(true),
  dailyLimit: z.number().min(0).optional(),
  restrictedProducts: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Dados mockados para produtos restritos
const mockRestrictedProducts = [
  { id: 'PROD001', name: 'Refrigerantes' },
  { id: 'PROD002', name: 'Doces' },
  { id: 'PROD003', name: 'Salgadinhos' },
  { id: 'PROD004', name: 'Chocolates' },
  { id: 'PROD005', name: 'Bebidas Energéticas' },
];

// Dados mockados para lotes
const mockBatches = [
  { id: 'LOT-2023-05A', name: 'Lote Maio 2023 - Cartões' },
  { id: 'LOT-2023-06B', name: 'Lote Junho 2023 - Pulseiras' },
  { id: 'LOT-2023-08C', name: 'Lote Agosto 2023 - Cartões Premium' },
];

export default function EditDevice() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  
  // Dados mockados para o dispositivo específico
  const deviceData = {
    id: deviceId || 'CARD-2023-8742',
    serial: 'CARD-2023-8742',
    uid: '04:A2:E9:12:5F',
    type: 'card',
    status: 'active',
    batch: 'LOT-2023-05A',
    batchName: 'Lote Maio 2023 - Cartões',
    activationDate: '2023-05-20',
    model: 'Modelo Padrão',
    school: {
      id: 'SCH001',
      name: 'Colégio São Paulo'
    },
    student: {
      id: 'STD00498',
      name: 'Maria Silva',
      grade: '9º Ano B',
      photo: 'https://i.pravatar.cc/150?img=5'
    },
    settings: {
      enabledFeatures: ['payments', 'access', 'identification'],
      dailyLimit: 50.0,
      restrictedProducts: ['PROD001', 'PROD002']
    },
  };

  // Configurar o formulário com valores iniciais do dispositivo
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: deviceData.status,
      type: deviceData.type,
      model: deviceData.model,
      serial: deviceData.serial,
      uid: deviceData.uid,
      batchId: deviceData.batch,
      enablePayments: deviceData.settings.enabledFeatures.includes('payments'),
      enableAccess: deviceData.settings.enabledFeatures.includes('access'),
      enableIdentification: deviceData.settings.enabledFeatures.includes('identification'),
      dailyLimit: deviceData.settings.dailyLimit,
      restrictedProducts: deviceData.settings.restrictedProducts,
      notes: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Dados atualizados:", data);
    
    toast.success("Dispositivo atualizado com sucesso!", {
      description: `O dispositivo ${data.serial} foi atualizado.`,
    });
    
    setTimeout(() => {
      navigate(`/devices/${deviceId}`);
    }, 1500);
  };

  // Função para bloquear o dispositivo
  const handleBlockDevice = () => {
    toast.success("Dispositivo bloqueado com sucesso!", {
      description: `O dispositivo ${deviceData.serial} foi bloqueado.`,
    });
    
    setTimeout(() => {
      navigate(`/devices/${deviceId}`);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(`/devices/${deviceId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Dispositivo</h1>
            <p className="text-muted-foreground">Edite as informações e configurações do dispositivo</p>
          </div>
        </div>
        <div>
          <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-1 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800">
                <Lock className="h-4 w-4" />
                Bloquear Dispositivo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bloquear Dispositivo</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá bloquear o dispositivo, impedindo seu uso para qualquer função. 
                  O estudante não poderá realizar pagamentos, controle de acesso ou identificação com este dispositivo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{deviceData.serial}</div>
                    <div className="text-sm text-muted-foreground">
                      Vinculado a: {deviceData.student.name}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium">Motivo do bloqueio:</label>
                  <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="lost">Perda relatada</option>
                    <option value="stolen">Roubo/furto</option>
                    <option value="damaged">Dano físico</option>
                    <option value="malfunction">Mau funcionamento</option>
                    <option value="preventive">Bloqueio preventivo</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleBlockDevice} className="bg-red-600 hover:bg-red-700">
                  Bloquear Dispositivo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Edite as informações básicas do dispositivo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="serial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Série</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormDescription>
                        O número de série não pode ser alterado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="uid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UID NFC</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormDescription>
                        O UID do dispositivo NFC não pode ser alterado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="transit">Em Trânsito</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Status atual do dispositivo
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                  name="batchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lote</FormLabel>
                      <Select
                        onValueChange={field.onChange}
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
                        Lote ao qual este dispositivo pertence
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Uso</CardTitle>
              <CardDescription>Edite as configurações de uso do dispositivo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Recursos Habilitados</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="enablePayments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Pagamentos</FormLabel>
                          <FormDescription>
                            Permite que o dispositivo seja usado para transações financeiras
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="enableAccess"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Controle de Acesso</FormLabel>
                          <FormDescription>
                            Permite que o dispositivo seja usado para entrada/saída da escola
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="enableIdentification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Identificação</FormLabel>
                          <FormDescription>
                            Permite que o dispositivo seja usado para identificação do aluno
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {form.watch('enablePayments') && (
                <>
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Configurações de Pagamento</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="dailyLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Limite Diário (R$)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="5"
                                {...field}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  field.onChange(isNaN(val) ? 0 : val);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Valor máximo que pode ser gasto por dia
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <FormLabel>Produtos Restritos</FormLabel>
                        <Card>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {mockRestrictedProducts.map((product) => (
                                <div key={product.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`product-${product.id}`}
                                    onCheckedChange={(checked) => {
                                      const currentProducts = form.getValues('restrictedProducts');
                                      if (checked) {
                                        form.setValue('restrictedProducts', [...currentProducts, product.id]);
                                      } else {
                                        form.setValue(
                                          'restrictedProducts',
                                          currentProducts.filter(id => id !== product.id)
                                        );
                                      }
                                    }}
                                    checked={form.getValues('restrictedProducts').includes(product.id)}
                                  />
                                  <label
                                    htmlFor={`product-${product.id}`}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {product.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                        <FormDescription>
                          Produtos que não poderão ser comprados com este dispositivo
                        </FormDescription>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
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
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => navigate(`/devices/${deviceId}`)}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

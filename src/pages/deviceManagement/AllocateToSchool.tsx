
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, School, Search, Check, Plus, X } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

// Esquema de formulário para alocação
const formSchema = z.object({
  schoolId: z.string({
    required_error: "Por favor, selecione uma escola",
  }),
  batchId: z.string().optional(),
  quantity: z.number().min(1, {
    message: "A quantidade deve ser pelo menos 1",
  }),
  deviceType: z.string().optional(),
  shippingMethod: z.string().optional(),
  shippingDate: z.string().optional(),
  trackingCode: z.string().optional(),
  notes: z.string().optional(),
  deviceIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Dados mockados para escolas
const mockSchools = [
  { id: 'SCH001', name: 'Colégio São Paulo' },
  { id: 'SCH002', name: 'Colégio Dom Bosco' },
  { id: 'SCH003', name: 'Instituto Futuro' },
  { id: 'SCH004', name: 'Escola Estadual Central' },
  { id: 'SCH005', name: 'Colégio Santa Maria' },
];

// Dados mockados para dispositivos
const mockDevices = [
  { serial: 'CARD-2023-8742', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
  { serial: 'WBAND-2023-3641', type: 'Pulseira', status: 'pending', batch: 'LOT-2023-06B' },
  { serial: 'CARD-2023-9134', type: 'Cartão Premium', status: 'active', batch: 'LOT-2023-08C' },
  { serial: 'WBAND-2023-5192', type: 'Pulseira', status: 'inactive', batch: 'LOT-2023-06B' },
  { serial: 'CARD-2023-6723', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
  { serial: 'CARD-2023-8743', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
  { serial: 'CARD-2023-8744', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
  { serial: 'CARD-2023-8745', type: 'Cartão', status: 'active', batch: 'LOT-2023-05A' },
];

// Dados mockados para lotes
const mockBatches = [
  { id: 'LOT-2023-05A', name: 'Lote Maio 2023 - Cartões', type: 'card', availableQuantity: 342 },
  { id: 'LOT-2023-06B', name: 'Lote Junho 2023 - Pulseiras', type: 'wristband', availableQuantity: 230 },
  { id: 'LOT-2023-08C', name: 'Lote Agosto 2023 - Cartões Premium', type: 'card', availableQuantity: 120 },
];

export default function AllocateToSchool() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allocationType, setAllocationType] = useState<'batch' | 'individual'>('batch');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 10,
      deviceType: '',
      shippingMethod: 'correios',
      shippingDate: '',
      trackingCode: '',
      notes: '',
      deviceIds: [],
    },
  });

  // Função para filtrar dispositivos com base na busca
  const filteredDevices = mockDevices.filter(device => 
    device.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data: FormValues) => {
    // Na etapa final, integramos os dispositivos selecionados
    if (step === 3) {
      const finalData = {
        ...data,
        deviceIds: allocationType === 'individual' ? selectedDevices : [],
      };
      
      console.log("Dados finais de alocação:", finalData);
      
      toast.success("Dispositivos alocados com sucesso!", {
        description: `${finalData.quantity} dispositivos foram alocados para a escola selecionada.`,
      });
      
      setTimeout(() => {
        navigate('/devices');
      }, 1500);
    } else {
      // Avança para o próximo passo
      setStep(step + 1);
    }
  };

  // Handler para selecionar/deselecionar dispositivos individuais
  const handleToggleDevice = (serial: string) => {
    setSelectedDevices(prev => 
      prev.includes(serial)
        ? prev.filter(id => id !== serial)
        : [...prev, serial]
    );
  };

  // Handler para selecionar todos os dispositivos
  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(device => device.serial));
    }
  };

  // Atualiza a quantidade quando um lote é selecionado
  const handleBatchChange = (batchId: string) => {
    const batch = mockBatches.find(b => b.id === batchId);
    if (batch) {
      form.setValue('deviceType', batch.type);
      // Define a quantidade máxima disponível por padrão
      form.setValue('quantity', batch.availableQuantity > 0 ? batch.availableQuantity : 0);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/devices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alocação de Dispositivos</h1>
            <p className="text-muted-foreground">Aloque dispositivos para uma escola</p>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progresso</CardTitle>
          <CardDescription>Acompanhe as etapas do processo de alocação</CardDescription>
          <div className="mt-2">
            <Progress value={(step / 3) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-sm">
              <div className={step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                1. Seleção de Escola
              </div>
              <div className={step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>
                2. Escolha de Dispositivos
              </div>
              <div className={step >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>
                3. Confirmação
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Etapa 1: Seleção de Escola */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Escola</CardTitle>
                <CardDescription>Escolha a escola para a qual deseja alocar os dispositivos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="schoolId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Escola</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma escola" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockSchools.map((school) => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Escola que receberá os dispositivos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <h3 className="font-medium text-lg mb-4">Método de Alocação</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={`border-2 cursor-pointer ${allocationType === 'batch' ? 'border-primary' : 'border-muted'}`} 
                          onClick={() => setAllocationType('batch')}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`p-2 rounded-full ${allocationType === 'batch' ? 'bg-primary/10' : 'bg-muted'}`}>
                          <Package className={`h-6 w-6 ${allocationType === 'batch' ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Por Lote</h4>
                          <p className="text-sm text-muted-foreground">Alocar múltiplos dispositivos de um mesmo lote</p>
                        </div>
                        {allocationType === 'batch' && (
                          <div className="ml-auto">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className={`border-2 cursor-pointer ${allocationType === 'individual' ? 'border-primary' : 'border-muted'}`} 
                          onClick={() => setAllocationType('individual')}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`p-2 rounded-full ${allocationType === 'individual' ? 'bg-primary/10' : 'bg-muted'}`}>
                          <CreditCard className={`h-6 w-6 ${allocationType === 'individual' ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium">Individual</h4>
                          <p className="text-sm text-muted-foreground">Selecionar dispositivos específicos para alocação</p>
                        </div>
                        {allocationType === 'individual' && (
                          <div className="ml-auto">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => navigate('/devices')}>
                    Cancelar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)}
                    disabled={!form.getValues('schoolId')}
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Etapa 2: Seleção de Dispositivos */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Dispositivos</CardTitle>
                <CardDescription>
                  {allocationType === 'batch' 
                    ? 'Escolha um lote e a quantidade de dispositivos para alocar' 
                    : 'Selecione dispositivos específicos para alocação'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {allocationType === 'batch' ? (
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
                              handleBatchChange(value);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um lote" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockBatches.map((batch) => (
                                <SelectItem key={batch.id} value={batch.id}>
                                  {batch.name} ({batch.availableQuantity} disponíveis)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Lote de dispositivos para alocação
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                field.onChange(isNaN(val) ? 0 : val);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Quantidade de dispositivos a serem alocados
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Dispositivo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                            Tipo de dispositivo a ser alocado
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-2">Dispositivos Disponíveis</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Selecione os dispositivos que deseja alocar para a escola
                      </p>
                      
                      <div className="mb-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Buscar por número de série, tipo ou lote..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox 
                                  checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                                  onCheckedChange={handleSelectAll}
                                />
                              </TableHead>
                              <TableHead>Número de Série</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Lote</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredDevices.length > 0 ? (
                              filteredDevices.map(device => (
                                <TableRow key={device.serial}>
                                  <TableCell>
                                    <Checkbox 
                                      checked={selectedDevices.includes(device.serial)} 
                                      onCheckedChange={() => handleToggleDevice(device.serial)}
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium">{device.serial}</TableCell>
                                  <TableCell>{device.type}</TableCell>
                                  <TableCell><StatusBadge status={device.status} /></TableCell>
                                  <TableCell>{device.batch}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                  Nenhum dispositivo encontrado com os critérios de busca
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedDevices.length} dispositivo(s) selecionado(s)
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <h3 className="font-medium text-lg mb-4">Informações de Envio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="shippingMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Método de Envio</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o método de envio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="correios">Correios</SelectItem>
                              <SelectItem value="transportadora">Transportadora</SelectItem>
                              <SelectItem value="entrega_propria">Entrega Própria</SelectItem>
                              <SelectItem value="retirada">Retirada no Local</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Como os dispositivos serão enviados
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="shippingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Envio</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="trackingCode"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Código de Rastreio</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Código de rastreio (se aplicável)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                          placeholder="Observações adicionais sobre esta alocação (opcional)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(3)}
                    disabled={allocationType === 'batch' 
                      ? !form.getValues('batchId') || !form.getValues('quantity')
                      : selectedDevices.length === 0
                    }
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Etapa 3: Confirmação */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Confirmar Alocação</CardTitle>
                <CardDescription>Revise os dados antes de finalizar a alocação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Escola Selecionada</h3>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <School className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {mockSchools.find(s => s.id === form.getValues('schoolId'))?.name || 'Escola Selecionada'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              ID: {form.getValues('schoolId')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Informações de Dispositivos</h3>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-4">
                        {allocationType === 'batch' ? (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Lote:</span>
                              <span className="text-sm font-medium">
                                {mockBatches.find(b => b.id === form.getValues('batchId'))?.name || 'Lote Selecionado'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Quantidade:</span>
                              <span className="text-sm font-medium">{form.getValues('quantity')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Tipo:</span>
                              <span className="text-sm font-medium">
                                {form.getValues('deviceType') === 'card' ? 'Cartão' : 'Pulseira'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Dispositivos Selecionados:</span>
                              <span className="text-sm font-medium">{selectedDevices.length}</span>
                            </div>
                            <div className="mt-2 max-h-24 overflow-y-auto text-sm">
                              {selectedDevices.map(serial => (
                                <div key={serial} className="py-1 border-b last:border-0">
                                  {serial}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Informações de Envio</h3>
                  <Card className="bg-gray-50 dark:bg-gray-900">
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Método de Envio:</span>
                          <p className="font-medium">
                            {(() => {
                              const method = form.getValues('shippingMethod');
                              if (method === 'correios') return 'Correios';
                              if (method === 'transportadora') return 'Transportadora';
                              if (method === 'entrega_propria') return 'Entrega Própria';
                              if (method === 'retirada') return 'Retirada no Local';
                              return method;
                            })()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Data de Envio:</span>
                          <p className="font-medium">
                            {form.getValues('shippingDate') || 'Não especificado'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Código de Rastreio:</span>
                        <p className="font-medium">
                          {form.getValues('trackingCode') || 'Não especificado'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {form.getValues('notes') && (
                  <div>
                    <h3 className="font-medium text-lg mb-4">Observações</h3>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-4">
                        <p className="text-sm">{form.getValues('notes')}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button type="submit">
                    Confirmar Alocação
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
}

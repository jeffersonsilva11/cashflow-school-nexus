
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, CreditCard, RefreshCw, AlertCircle, Check, Search } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Esquema de formulário para substituição de dispositivo
const formSchema = z.object({
  newDeviceId: z.string({
    required_error: "Por favor, selecione um novo dispositivo",
  }),
  replacementReason: z.string({
    required_error: "Por favor, selecione um motivo para a substituição",
  }),
  transferBalance: z.boolean().default(true),
  transferConfigurations: z.boolean().default(true),
  chargeReplacement: z.boolean().default(false),
  notifyContacts: z.boolean().default(true),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Dados mockados para dispositivos disponíveis
const mockDevices = [
  { id: 'DEV001', serial: 'CARD-2023-1111', type: 'Cartão', status: 'pending' },
  { id: 'DEV002', serial: 'WBAND-2023-2222', type: 'Pulseira', status: 'pending' },
  { id: 'DEV003', serial: 'CARD-2023-3333', type: 'Cartão Premium', status: 'pending' },
  { id: 'DEV004', serial: 'WBAND-2023-4444', type: 'Pulseira', status: 'pending' },
  { id: 'DEV005', serial: 'CARD-2023-5555', type: 'Cartão', status: 'pending' },
];

export default function ReplaceDevice() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();
  const [step, setStep] = useState(1);
  const [isReading, setIsReading] = useState(false);
  const [deviceSearchQuery, setDeviceSearchQuery] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  
  // Dados mockados para o dispositivo atual
  const currentDeviceData = {
    id: deviceId || 'CARD-2023-8742',
    serial: 'CARD-2023-8742',
    uid: '04:A2:E9:12:5F',
    type: 'Cartão',
    status: 'active',
    batch: 'LOT-2023-05A',
    batchName: 'Lote Maio 2023 - Cartões',
    activationDate: '2023-05-20',
    balance: 87.50,
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
      restrictedProducts: ['Refrigerantes', 'Doces']
    },
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      replacementReason: '',
      transferBalance: true,
      transferConfigurations: true,
      chargeReplacement: false,
      notifyContacts: true,
      notes: '',
    },
  });

  // Filtragem de dispositivos
  const filteredDevices = mockDevices.filter(device => 
    device.serial.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
    device.id.toLowerCase().includes(deviceSearchQuery.toLowerCase())
  );

  const onSubmit = (data: FormValues) => {
    // Na etapa final, executamos a substituição
    if (step === 3) {
      console.log("Dados de substituição:", {
        currentDeviceId: deviceId,
        ...data,
      });
      
      toast.success("Dispositivo substituído com sucesso!", {
        description: `O dispositivo foi substituído e está pronto para uso.`,
      });
      
      setTimeout(() => {
        navigate(`/devices/${data.newDeviceId}`);
      }, 1500);
    } else {
      // Avança para o próximo passo
      setStep(step + 1);
    }
  };

  // Função simulada para leitura de NFC
  const handleDeviceRead = () => {
    setIsReading(true);
    
    // Simulação de leitura NFC após 2 segundos
    setTimeout(() => {
      // Seleciona um dispositivo aleatório da lista
      const randomDevice = mockDevices[Math.floor(Math.random() * mockDevices.length)];
      setSelectedDevice(randomDevice.id);
      form.setValue('newDeviceId', randomDevice.id);
      setIsReading(false);
      toast.success("Dispositivo NFC lido com sucesso!", {
        description: `Dispositivo: ${randomDevice.serial}`,
      });
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(`/devices/${deviceId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Substituir Dispositivo</h1>
            <p className="text-muted-foreground">Substitua o dispositivo mantendo as configurações e saldo</p>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progresso</CardTitle>
          <CardDescription>Acompanhe as etapas do processo de substituição</CardDescription>
          <div className="mt-2">
            <Progress value={(step / 3) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-sm">
              <div className={step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                1. Dispositivo Atual
              </div>
              <div className={step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>
                2. Novo Dispositivo
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
          {/* Etapa 1: Dispositivo Atual */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Dispositivo Atual</CardTitle>
                <CardDescription>Informações do dispositivo que será substituído</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-4">Informações do Dispositivo</h3>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <StatusBadge status={currentDeviceData.status} />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Número de Série</span>
                              <span className="text-sm font-medium">{currentDeviceData.serial}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">UID NFC</span>
                              <span className="text-sm font-medium">{currentDeviceData.uid}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Tipo</span>
                              <span className="text-sm font-medium">{currentDeviceData.type}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Lote</span>
                              <span className="text-sm font-medium">{currentDeviceData.batch}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Saldo Atual</span>
                              <span className="text-sm font-medium">R$ {currentDeviceData.balance.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-4">Estudante Vinculado</h3>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center py-4">
                          <div className="h-16 w-16 rounded-full overflow-hidden mb-4">
                            <img src={currentDeviceData.student.photo} alt={currentDeviceData.student.name} className="h-full w-full object-cover" />
                          </div>
                          <h3 className="font-bold text-lg mb-1">{currentDeviceData.student.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{currentDeviceData.student.grade}</p>
                          <p className="text-sm text-muted-foreground mb-4">ID: {currentDeviceData.student.id}</p>
                          
                          <div className="w-full border-t pt-4 mt-2">
                            <p className="text-sm">
                              <span className="font-medium">Escola:</span> {currentDeviceData.school.name}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <FormField
                  control={form.control}
                  name="replacementReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da Substituição</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lost">Perda</SelectItem>
                          <SelectItem value="stolen">Roubo/Furto</SelectItem>
                          <SelectItem value="damaged">Dano Físico</SelectItem>
                          <SelectItem value="malfunction">Mau Funcionamento</SelectItem>
                          <SelectItem value="expired">Expirado</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Motivo pelo qual o dispositivo está sendo substituído
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                          placeholder="Observações adicionais sobre esta substituição (opcional)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => navigate(`/devices/${deviceId}`)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)}
                    disabled={!form.getValues('replacementReason')}
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Etapa 2: Novo Dispositivo */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Novo Dispositivo</CardTitle>
                <CardDescription>Selecione o dispositivo que substituirá o atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center mb-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 relative mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                    {isReading && (
                      <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-primary" />
                    )}
                  </div>
                  <p className="font-medium mb-1">Leitura de Novo Dispositivo NFC</p>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Aproxime um cartão ou pulseira do leitor para identificar o novo dispositivo
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleDeviceRead}
                    disabled={isReading}
                  >
                    Ler Novo Dispositivo
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-medium text-lg mb-4">Ou Selecione da Lista</h3>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar dispositivo..."
                      value={deviceSearchQuery}
                      onChange={(e) => setDeviceSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número de Série</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.length > 0 ? (
                        filteredDevices.map(device => (
                          <TableRow key={device.id}>
                            <TableCell>{device.serial}</TableCell>
                            <TableCell>{device.type}</TableCell>
                            <TableCell><StatusBadge status={device.status} /></TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm" 
                                variant={selectedDevice === device.id ? "default" : "outline"}
                                onClick={() => {
                                  setSelectedDevice(device.id);
                                  form.setValue('newDeviceId', device.id);
                                }}
                              >
                                {selectedDevice === device.id ? (
                                  <>
                                    <Check className="mr-1 h-4 w-4" /> Selecionado
                                  </>
                                ) : "Selecionar"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            Nenhum dispositivo encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-medium text-lg mb-4">Opções de Transferência</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="transferBalance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Transferir Saldo</FormLabel>
                          <FormDescription>
                            Transfere o saldo atual (R$ {currentDeviceData.balance.toFixed(2)}) para o novo dispositivo
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="transferConfigurations"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Transferir Configurações</FormLabel>
                          <FormDescription>
                            Mantém as mesmas configurações e permissões no novo dispositivo
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="chargeReplacement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Cobrar Taxa de Substituição</FormLabel>
                          <FormDescription>
                            Gera cobrança de taxa para 2ª via do dispositivo
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notifyContacts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Notificar Contatos</FormLabel>
                          <FormDescription>
                            Envia notificação aos responsáveis sobre a substituição
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(3)}
                    disabled={!selectedDevice}
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
                <CardTitle>Confirmar Substituição</CardTitle>
                <CardDescription>Revise os detalhes antes de finalizar a substituição</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <CreditCard className="h-6 w-6 text-yellow-700" />
                      </div>
                      <p className="mt-2 text-sm font-medium">{currentDeviceData.serial}</p>
                      <p className="text-xs text-muted-foreground">Dispositivo atual</p>
                    </div>
                    
                    <div className="mx-4 flex flex-col items-center">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <RefreshCw className="h-4 w-4 text-primary" />
                      </div>
                      <div className="h-0.5 w-16 bg-primary/30 mt-2"></div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-green-100 p-3 rounded-full">
                        <CreditCard className="h-6 w-6 text-green-700" />
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        {mockDevices.find(d => d.id === selectedDevice)?.serial || ''}
                      </p>
                      <p className="text-xs text-muted-foreground">Novo dispositivo</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Detalhes da Substituição</h3>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Estudante:</span>
                            <span className="text-sm font-medium">{currentDeviceData.student.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Escola:</span>
                            <span className="text-sm font-medium">{currentDeviceData.school.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Motivo:</span>
                            <span className="text-sm font-medium">
                              {(() => {
                                const reason = form.getValues('replacementReason');
                                if (reason === 'lost') return 'Perda';
                                if (reason === 'stolen') return 'Roubo/Furto';
                                if (reason === 'damaged') return 'Dano Físico';
                                if (reason === 'malfunction') return 'Mau Funcionamento';
                                if (reason === 'expired') return 'Expirado';
                                if (reason === 'other') return 'Outro';
                                return '';
                              })()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Opções Selecionadas</h3>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-4">
                        <ul className="space-y-2">
                          {form.getValues('transferBalance') && (
                            <li className="flex items-center text-sm">
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                              <span>Transferir saldo de R$ {currentDeviceData.balance.toFixed(2)}</span>
                            </li>
                          )}
                          {form.getValues('transferConfigurations') && (
                            <li className="flex items-center text-sm">
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                              <span>Transferir configurações e permissões</span>
                            </li>
                          )}
                          {form.getValues('chargeReplacement') && (
                            <li className="flex items-center text-sm">
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                              <span>Cobrar taxa de substituição</span>
                            </li>
                          )}
                          {form.getValues('notifyContacts') && (
                            <li className="flex items-center text-sm">
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                              <span>Notificar responsáveis sobre a substituição</span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
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
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex">
                  <AlertCircle className="h-5 w-5 text-yellow-800 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Atenção</h4>
                    <p className="text-sm text-yellow-800">
                      Ao confirmar esta substituição, o dispositivo atual será desativado e todas as 
                      configurações definidas serão transferidas para o novo dispositivo.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button type="submit" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Confirmar Substituição
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

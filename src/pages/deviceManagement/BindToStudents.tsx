
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, User, CreditCard, Upload, Check, Search, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Esquema de formulário para vinculação
const formSchema = z.object({
  schoolId: z.string({
    required_error: "Por favor, selecione uma escola",
  }),
  deviceId: z.string().optional(),
  studentId: z.string().optional(),
  enablePayments: z.boolean().default(true),
  enableAccess: z.boolean().default(true),
  enableIdentification: z.boolean().default(true),
  dailyLimit: z.number().min(0).optional(),
  restrictedProducts: z.array(z.string()).default([]),
  notes: z.string().optional(),
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

// Dados mockados para estudantes
const mockStudents = [
  { id: 'STD001', name: 'Ana Silva', grade: '9º Ano A', photo: 'https://i.pravatar.cc/150?img=1' },
  { id: 'STD002', name: 'João Pedro', grade: '8º Ano B', photo: 'https://i.pravatar.cc/150?img=3' },
  { id: 'STD003', name: 'Maria Eduarda', grade: '7º Ano A', photo: 'https://i.pravatar.cc/150?img=5' },
  { id: 'STD004', name: 'Pedro Henrique', grade: '9º Ano B', photo: 'https://i.pravatar.cc/150?img=7' },
  { id: 'STD005', name: 'Beatriz Costa', grade: '6º Ano A', photo: 'https://i.pravatar.cc/150?img=9' },
];

// Dados mockados para dispositivos disponíveis
const mockDevices = [
  { id: 'DEV001', serial: 'CARD-2023-8742', type: 'Cartão', status: 'pending' },
  { id: 'DEV002', serial: 'WBAND-2023-3641', type: 'Pulseira', status: 'pending' },
  { id: 'DEV003', serial: 'CARD-2023-9134', type: 'Cartão Premium', status: 'pending' },
  { id: 'DEV004', serial: 'WBAND-2023-5192', type: 'Pulseira', status: 'pending' },
  { id: 'DEV005', serial: 'CARD-2023-6723', type: 'Cartão', status: 'pending' },
];

// Dados mockados para produtos restritos
const mockRestrictedProducts = [
  { id: 'PROD001', name: 'Refrigerantes' },
  { id: 'PROD002', name: 'Doces' },
  { id: 'PROD003', name: 'Salgadinhos' },
  { id: 'PROD004', name: 'Chocolates' },
  { id: 'PROD005', name: 'Bebidas Energéticas' },
];

export default function BindToStudents() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('individual');
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [deviceSearchQuery, setDeviceSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [uploadedCsv, setUploadedCsv] = useState<File | null>(null);
  const [bulkBindings, setBulkBindings] = useState<{student: string, device: string}[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enablePayments: true,
      enableAccess: true,
      enableIdentification: true,
      dailyLimit: 50,
      restrictedProducts: [],
      notes: '',
    },
  });

  // Filtragem de estudantes
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  // Filtragem de dispositivos
  const filteredDevices = mockDevices.filter(device => 
    device.serial.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
    device.id.toLowerCase().includes(deviceSearchQuery.toLowerCase())
  );

  const onSubmit = (data: FormValues) => {
    // Na etapa final, executamos a vinculação
    if (step === 3) {
      let successMessage = '';
      
      if (activeTab === 'individual') {
        console.log("Dados de vinculação individual:", {
          ...data,
          deviceId: selectedDevice,
          studentId: selectedStudent
        });
        
        successMessage = 'Dispositivo vinculado com sucesso ao estudante!';
      } else {
        console.log("Dados de vinculação em massa:", {
          ...data,
          bindings: bulkBindings
        });
        
        successMessage = `${bulkBindings.length} dispositivos foram vinculados com sucesso!`;
      }
      
      toast.success(successMessage, {
        description: "Os dispositivos estão prontos para uso.",
      });
      
      setTimeout(() => {
        navigate('/devices');
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
      setIsReading(false);
      toast.success("Dispositivo NFC lido com sucesso!", {
        description: `Dispositivo: ${randomDevice.serial}`,
      });
    }, 2000);
  };

  // Manipulador para upload de CSV
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadedCsv(file);
    
    // Simulamos a leitura e processamento do arquivo CSV
    setTimeout(() => {
      // Gera alguns mapeamentos mockados
      const mockBindings = [
        { student: 'STD001', device: 'DEV001' },
        { student: 'STD002', device: 'DEV002' },
        { student: 'STD003', device: 'DEV003' },
      ];
      
      setBulkBindings(mockBindings);
      
      toast.success("Arquivo CSV processado com sucesso!", {
        description: `${mockBindings.length} mapeamentos foram identificados.`,
      });
    }, 1000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/devices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vincular Dispositivos a Alunos</h1>
            <p className="text-muted-foreground">Associe dispositivos NFC a estudantes</p>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progresso</CardTitle>
          <CardDescription>Acompanhe as etapas do processo de vinculação</CardDescription>
          <div className="mt-2">
            <Progress value={(step / 3) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-sm">
              <div className={step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                1. Seleção de Escola
              </div>
              <div className={step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>
                2. Vincular Dispositivos
              </div>
              <div className={step >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>
                3. Configurações e Confirmação
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
                <CardDescription>Escolha a escola onde os alunos estão matriculados</CardDescription>
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
                        Escola onde os alunos e dispositivos estão registrados
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <h3 className="font-medium text-lg mb-4">Método de Vinculação</h3>
                  
                  <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="individual" className="flex items-center gap-2">
                        <User size={16} />
                        <span>Individual</span>
                      </TabsTrigger>
                      <TabsTrigger value="bulk" className="flex items-center gap-2">
                        <Upload size={16} />
                        <span>Em Massa</span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="individual" className="p-4 border rounded-md mt-4">
                      <div>
                        <h4 className="font-medium mb-2">Vinculação Individual</h4>
                        <p className="text-sm text-muted-foreground">
                          Vincule um dispositivo a um estudante específico. Ideal para casos pontuais ou quando precisar 
                          configurar permissões especiais para um estudante.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="bulk" className="p-4 border rounded-md mt-4">
                      <div>
                        <h4 className="font-medium mb-2">Vinculação em Massa</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Importe um arquivo CSV com mapeamento entre alunos e dispositivos para realizar 
                          múltiplas vinculações de uma só vez.
                        </p>
                        
                        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                          <p className="font-medium mb-1">Arraste um arquivo CSV ou clique para selecionar</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            CSV com colunas: ID_ALUNO, ID_DISPOSITIVO
                          </p>
                          <div className="relative">
                            <Button variant="outline" className="relative">
                              Selecionar Arquivo
                              <input
                                type="file"
                                accept=".csv"
                                onChange={handleCsvUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </Button>
                          </div>
                          {uploadedCsv && (
                            <div className="flex items-center mt-4 bg-gray-100 p-2 rounded-md">
                              <Check className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-sm">{uploadedCsv.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
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
          
          {/* Etapa 2: Vinculação */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Vincular Dispositivos</CardTitle>
                <CardDescription>
                  {activeTab === 'individual' 
                    ? 'Selecione um estudante e um dispositivo para vincular' 
                    : 'Confirme o mapeamento de vinculações em massa'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'individual' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">Selecionar Estudante</h3>
                      <div className="mb-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Buscar por nome, matrícula ou turma..."
                            value={studentSearchQuery}
                            onChange={(e) => setStudentSearchQuery(e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map(student => (
                            <div
                              key={student.id}
                              className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-colors
                                ${selectedStudent === student.id ? 'border-2 border-primary bg-primary/5' : 'hover:bg-accent'}`}
                              onClick={() => setSelectedStudent(student.id)}
                            >
                              <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                                <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="flex-grow">
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.grade}</div>
                                <div className="text-xs text-muted-foreground">ID: {student.id}</div>
                              </div>
                              {selectedStudent === student.id && (
                                <div className="flex-shrink-0">
                                  <Check className="h-5 w-5 text-primary" />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            Nenhum estudante encontrado com os critérios de busca
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Selecionar Dispositivo</h3>
                      
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 relative mb-4">
                          <CreditCard className="h-8 w-8 text-primary" />
                          {isReading && (
                            <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-primary" />
                          )}
                        </div>
                        <p className="font-medium mb-1">Leitura de Dispositivo NFC</p>
                        <p className="text-sm text-muted-foreground mb-4 text-center">
                          Aproxime um cartão ou pulseira do leitor para identificar o dispositivo
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={handleDeviceRead}
                          disabled={isReading}
                        >
                          Ler Dispositivo
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
                      
                      <div className="max-h-[220px] overflow-y-auto border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Número de Série</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredDevices.length > 0 ? (
                              filteredDevices.map(device => (
                                <TableRow key={device.id}>
                                  <TableCell>{device.serial}</TableCell>
                                  <TableCell>{device.type}</TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      size="sm" 
                                      variant={selectedDevice === device.id ? "default" : "outline"}
                                      onClick={() => setSelectedDevice(device.id)}
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
                                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                  Nenhum dispositivo encontrado
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-lg mb-4">Confirmar Vinculações em Massa</h3>
                    
                    {bulkBindings.length > 0 ? (
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>#</TableHead>
                              <TableHead>ID do Estudante</TableHead>
                              <TableHead>ID do Dispositivo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bulkBindings.map((binding, index) => (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {binding.student} - {
                                    mockStudents.find(s => s.id === binding.student)?.name || 'Desconhecido'
                                  }
                                </TableCell>
                                <TableCell>
                                  {binding.device} - {
                                    mockDevices.find(d => d.id === binding.device)?.serial || 'Desconhecido'
                                  }
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-md">
                        <p className="text-muted-foreground">
                          {uploadedCsv ? 'Processando arquivo...' : 'Nenhum arquivo CSV carregado'}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <h4 className="flex items-center font-medium text-yellow-800">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Importante
                      </h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        As configurações definidas na próxima etapa serão aplicadas a todos os dispositivos listados acima.
                        Para configurações específicas por aluno, utilize o modo de vinculação individual.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-6">
                  <Button variant="outline" type="button" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(3)}
                    disabled={activeTab === 'individual' 
                      ? !selectedStudent || !selectedDevice
                      : bulkBindings.length === 0
                    }
                  >
                    Próximo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Etapa 3: Configurações e Confirmação */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Configurar e Confirmar</CardTitle>
                <CardDescription>Defina as configurações e confirme a vinculação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Recursos Habilitados</h3>
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-4 space-y-4">
                        <FormField
                          control={form.control}
                          name="enablePayments"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                      </CardContent>
                    </Card>
                  </div>
                  
                  {form.watch('enablePayments') && (
                    <div>
                      <h3 className="font-medium text-lg mb-4">Configurações de Pagamento</h3>
                      <Card className="bg-gray-50 dark:bg-gray-900">
                        <CardContent className="p-4 space-y-4">
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
                            <div className="grid grid-cols-2 gap-2">
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
                            <FormDescription>
                              Produtos que não poderão ser comprados com este dispositivo
                            </FormDescription>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
                
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
                          placeholder="Observações adicionais sobre esta vinculação (opcional)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Resumo da Vinculação</h3>
                  <Card className="bg-gray-50 dark:bg-gray-900">
                    <CardContent className="p-4">
                      {activeTab === 'individual' ? (
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">Estudante</h4>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                                <img 
                                  src={mockStudents.find(s => s.id === selectedStudent)?.photo || ''} 
                                  alt="Foto do Estudante" 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {mockStudents.find(s => s.id === selectedStudent)?.name || ''}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {mockStudents.find(s => s.id === selectedStudent)?.grade || ''}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Separator orientation="vertical" className="hidden md:block h-auto" />
                          <Separator className="md:hidden" />
                          
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">Dispositivo</h4>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                                <CreditCard className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {mockDevices.find(d => d.id === selectedDevice)?.serial || ''}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {mockDevices.find(d => d.id === selectedDevice)?.type || ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-2 pb-2 border-b">
                            <span className="font-medium">Escola:</span>{' '}
                            {mockSchools.find(s => s.id === form.getValues('schoolId'))?.name || ''}
                          </div>
                          <div className="mb-2">
                            <span className="font-medium">{bulkBindings.length} vinculações</span> serão realizadas
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Todas as configurações definidas acima serão aplicadas a todos os dispositivos.
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {form.watch('enablePayments') && (
                          <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center justify-center">
                            <Check size={12} className="mr-1" /> Pagamentos
                          </div>
                        )}
                        {form.watch('enableAccess') && (
                          <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center justify-center">
                            <Check size={12} className="mr-1" /> Controle de Acesso
                          </div>
                        )}
                        {form.watch('enableIdentification') && (
                          <div className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center justify-center">
                            <Check size={12} className="mr-1" /> Identificação
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button type="submit">
                    Confirmar Vinculação
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

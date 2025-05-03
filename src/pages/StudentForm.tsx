
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, User, School, UserRound, MapPin, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { StudentCard } from '@/components/devices/StudentCard';
import { ParentsMultiSelect, ParentOption } from '@/components/students/ParentsMultiSelect';
import { Switch } from '@/components/ui/switch';

// Definir o esquema de validação com Zod
const studentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  school: z.string().min(1, "Escola é obrigatória"),
  grade: z.string().min(1, "Turma é obrigatória"),
  parentIds: z.array(z.string()).min(1, "Pelo menos um responsável deve ser selecionado"),
  dateOfBirth: z.string().refine(value => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }, {
    message: "Data de nascimento inválida",
  }),
  documentId: z.string().optional(),
  notes: z.string().optional(),
  geofencingEnabled: z.boolean().default(true),
  geofencingRadius: z.number().min(50, "O raio mínimo é de 50 metros").max(500, "O raio máximo é de 500 metros").default(100),
  notifyOnApproach: z.boolean().default(true),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function StudentForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data que seria obtido da API
  const schools = [
    { id: 'SCH001', name: 'Colégio São Paulo' },
    { id: 'SCH002', name: 'Escola Maria Eduarda' },
    { id: 'SCH003', name: 'Colégio São Pedro' }
  ];
  
  const grades = [
    '1º Ano A', '2º Ano A', '3º Ano A', '4º Ano A', '5º Ano A',
    '6º Ano A', '7º Ano A', '8º Ano A', '9º Ano A',
    '1º Ano B', '2º Ano B', '3º Ano B', '4º Ano B', '5º Ano B',
    '6º Ano B', '7º Ano B', '8º Ano B', '9º Ano B',
  ];
  
  const parents: ParentOption[] = [
    { id: 'PAR001', name: 'José Silva', email: 'jose.silva@exemplo.com' },
    { id: 'PAR002', name: 'Maria Oliveira', email: 'maria.oliveira@exemplo.com' },
    { id: 'PAR003', name: 'Carlos Santos', email: 'carlos.santos@exemplo.com' },
    { id: 'PAR004', name: 'Ana Pereira', email: 'ana.pereira@exemplo.com' },
    { id: 'PAR005', name: 'Roberto Costa', email: 'roberto.costa@exemplo.com' },
  ];
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      school: '',
      grade: '',
      parentIds: [],
      dateOfBirth: '',
      documentId: '',
      notes: '',
      geofencingEnabled: true,
      geofencingRadius: 100,
      notifyOnApproach: true,
    },
  });
  
  const [previewData, setPreviewData] = React.useState<{
    id: string;
    name: string;
    grade: string;
    photo: string;
  } | undefined>(undefined);
  
  // Atualiza a prévia do cartão do estudante quando o nome ou turma mudam
  React.useEffect(() => {
    const name = form.watch('name');
    const grade = form.watch('grade');
    
    if (name && grade) {
      setPreviewData({
        id: 'NOVO',
        name,
        grade,
        photo: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Avatar aleatório
      });
    } else {
      setPreviewData(undefined);
    }
  }, [form.watch('name'), form.watch('grade')]);
  
  const onSubmit = async (data: StudentFormValues) => {
    console.log("Dados do formulário:", data);
    
    // Aqui seria feita a chamada à API para cadastrar o aluno
    // Simulando um tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulando um ID gerado pelo backend
    const newStudentId = `STD${Math.floor(10000 + Math.random() * 90000)}`;
    
    toast({
      title: "Aluno cadastrado com sucesso",
      description: `O aluno ${data.name} foi cadastrado com o ID ${newStudentId}`,
    });
    
    // Redireciona para a página de detalhes do aluno recém-criado
    navigate(`/students/${newStudentId}`);
  };
  
  const geofencingEnabled = form.watch('geofencingEnabled');
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/students')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Aluno</h1>
            <p className="text-muted-foreground">Cadastre um novo aluno no sistema.</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulário principal */}
        <div className="md:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Informações do Aluno</CardTitle>
                  </div>
                  <CardDescription>
                    Dados pessoais para cadastro do aluno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="documentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Documento (CPF ou RG)</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormDescription>
                            Opcional
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Input placeholder="Informações adicionais (opcional)" {...field} />
                        </FormControl>
                        <FormDescription>
                          Alergias, restrições alimentares ou outras informações relevantes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <School className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Informações Escolares</CardTitle>
                  </div>
                  <CardDescription>
                    Vínculos escolares do aluno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="school"
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
                            {schools.map(school => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Turma</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma turma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grades.map(grade => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Responsáveis</CardTitle>
                  </div>
                  <CardDescription>
                    Responsáveis legais pelo aluno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="parentIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecione um ou mais responsáveis</FormLabel>
                        <ParentsMultiSelect
                          options={parents}
                          selectedValues={field.value}
                          onChange={field.onChange}
                          placeholder="Selecione os responsáveis"
                        />
                        <FormDescription>
                          <Button 
                            variant="link" 
                            type="button"
                            className="p-0 h-auto"
                            onClick={() => navigate('/parents/new')}
                          >
                            Cadastrar novo responsável
                          </Button>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Geolocalização</CardTitle>
                  </div>
                  <CardDescription>
                    Configurações da cerca eletrônica para detecção de aproximação dos responsáveis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="geofencingEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Ativar Cerca Eletrônica</FormLabel>
                          <FormDescription>
                            Detectar quando o responsável se aproxima da escola
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {geofencingEnabled && (
                    <>
                      <FormField
                        control={form.control}
                        name="geofencingRadius"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Raio de detecção (metros)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={50}
                                max={500}
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 100)}
                              />
                            </FormControl>
                            <FormDescription>
                              Distância em metros da escola para detecção da aproximação
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notifyOnApproach"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Notificar na aproximação</FormLabel>
                              <FormDescription>
                                Enviar notificação para a escola quando o responsável estiver próximo
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex gap-2 items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium">Informação Importante</p>
                          <p>A funcionalidade de cerca eletrônica depende do aplicativo do responsável. 
                          O responsável precisa ter o aplicativo instalado e autorizar o compartilhamento de localização 
                          para que a detecção de aproximação funcione corretamente.</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/students')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Aluno
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Card do aluno (prévia) */}
        <div>
          <p className="text-sm font-semibold mb-2">Prévia do Cadastro</p>
          <StudentCard student={previewData} />
        </div>
      </div>
    </div>
  );
}

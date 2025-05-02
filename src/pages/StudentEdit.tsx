
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save, User, School, UserRound } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { StudentCard } from '@/components/devices/StudentCard';

// Definir o esquema de validação com Zod (igual ao do StudentForm)
const studentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  school: z.string().min(1, "Escola é obrigatória"),
  grade: z.string().min(1, "Turma é obrigatória"),
  parentId: z.string().min(1, "Responsável é obrigatório"),
  dateOfBirth: z.string().refine(value => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }, {
    message: "Data de nascimento inválida",
  }),
  documentId: z.string().optional(),
  notes: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function StudentEdit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { studentId } = useParams<{ studentId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const parents = [
    { id: 'PAR001', name: 'José Silva', email: 'jose.silva@exemplo.com' },
    { id: 'PAR002', name: 'Maria Oliveira', email: 'maria.oliveira@exemplo.com' },
    { id: 'PAR003', name: 'Carlos Santos', email: 'carlos.santos@exemplo.com' },
    { id: 'PAR004', name: 'Ana Pereira', email: 'ana.pereira@exemplo.com' },
    { id: 'PAR005', name: 'Roberto Costa', email: 'roberto.costa@exemplo.com' },
  ];
  
  // Dados mockados do estudante que está sendo editado
  const studentMockData = {
    'STD00498': {
      id: 'STD00498',
      name: 'Maria Silva',
      grade: '9º Ano B',
      school: 'SCH001',
      parentId: 'PAR001',
      dateOfBirth: '2008-05-15',
      documentId: '123.456.789-00',
      notes: 'Alergia a amendoim',
      photo: 'https://i.pravatar.cc/150?img=5',
      status: 'active',
      deviceStatus: 'active'
    },
    'STD00512': {
      id: 'STD00512',
      name: 'João Oliveira',
      grade: '7º Ano A',
      school: 'SCH001',
      parentId: 'PAR002',
      dateOfBirth: '2010-03-22',
      documentId: '987.654.321-00',
      notes: '',
      photo: 'https://i.pravatar.cc/150?img=3',
      status: 'active',
      deviceStatus: 'inactive'
    }
  };
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      school: '',
      grade: '',
      parentId: '',
      dateOfBirth: '',
      documentId: '',
      notes: '',
    },
  });
  
  const [previewData, setPreviewData] = useState<{
    id: string;
    name: string;
    grade: string;
    photo: string;
    status?: 'active' | 'inactive' | 'pending';
    deviceStatus?: 'active' | 'inactive' | 'pending';
  } | undefined>(undefined);
  
  // Carrega os dados do estudante quando o componente é montado
  useEffect(() => {
    if (studentId) {
      // Aqui seria feita a chamada à API para buscar os dados do estudante
      // Simulando o tempo de busca
      setIsLoading(true);
      
      setTimeout(() => {
        const student = studentMockData[studentId as keyof typeof studentMockData];
        
        if (student) {
          form.reset({
            name: student.name,
            school: student.school,
            grade: student.grade,
            parentId: student.parentId,
            dateOfBirth: student.dateOfBirth,
            documentId: student.documentId || '',
            notes: student.notes || '',
          });
          
          setPreviewData({
            id: student.id,
            name: student.name,
            grade: student.grade,
            photo: student.photo,
            status: student.status,
            deviceStatus: student.deviceStatus,
          });
        } else {
          toast({
            title: "Erro ao carregar dados",
            description: `Não foi possível encontrar o aluno com ID ${studentId}`,
            variant: "destructive",
          });
          navigate('/students');
        }
        
        setIsLoading(false);
      }, 1000);
    }
  }, [studentId, form, navigate, toast]);
  
  // Atualiza a prévia do cartão do estudante quando o nome ou turma mudam
  useEffect(() => {
    const name = form.watch('name');
    const grade = form.watch('grade');
    
    if (name && grade && previewData) {
      setPreviewData(prev => prev ? {
        ...prev,
        name,
        grade,
      } : undefined);
    }
  }, [form.watch('name'), form.watch('grade'), previewData]);
  
  const onSubmit = async (data: StudentFormValues) => {
    // Aqui seria feita a chamada à API para atualizar os dados do aluno
    console.log("Dados do formulário para atualização:", data);
    
    // Simulando um tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Aluno atualizado com sucesso",
      description: `Os dados de ${data.name} foram atualizados com sucesso`,
    });
    
    // Redireciona para a página de detalhes do aluno
    navigate(`/students/${studentId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <p className="text-muted-foreground">Carregando dados do aluno...</p>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/students/${studentId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Aluno</h1>
            <p className="text-muted-foreground">Atualize os dados do aluno no sistema.</p>
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
                    Dados pessoais do aluno
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
                          value={field.value}
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
                          value={field.value}
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
                    <CardTitle>Responsável</CardTitle>
                  </div>
                  <CardDescription>
                    Responsável legal pelo aluno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um responsável" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parents.map(parent => (
                              <SelectItem key={parent.id} value={parent.id}>
                                {parent.name} ({parent.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
              
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate(`/students/${studentId}`)}
                >
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
        
        {/* Card do aluno (prévia) */}
        <div>
          <p className="text-sm font-semibold mb-2">Prévia do Cadastro</p>
          <StudentCard student={previewData} />
        </div>
      </div>
    </div>
  );
}

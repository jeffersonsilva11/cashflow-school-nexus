
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreatePaymentData, paymentService } from '@/services/paymentService';

// Esquema de validação
const paymentSchema = z.object({
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O valor deve ser maior que zero",
  }),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  method: z.enum(['credit_card', 'bank_slip', 'pix']),
  dueDate: z.string().optional(),
  studentId: z.string().optional(),
  studentName: z.string().optional(),
  parentId: z.string().optional(),
  parentName: z.string().optional(),
  schoolId: z.string().optional(),
  schoolName: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function NewPayment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data para selects
  const schools = [
    { id: 'SCH001', name: 'Colégio São Paulo' },
    { id: 'SCH002', name: 'Escola Maria Eduarda' },
    { id: 'SCH003', name: 'Colégio São Pedro' }
  ];
  
  const students = [
    { id: 'STD001', name: 'Lucas Silva', parentId: 'PAR001', parentName: 'José Silva' },
    { id: 'STD002', name: 'Maria Oliveira', parentId: 'PAR002', parentName: 'Ana Oliveira' },
    { id: 'STD003', name: 'João Santos', parentId: 'PAR003', parentName: 'Carlos Santos' }
  ];
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: '',
      description: '',
      method: 'credit_card',
      dueDate: '',
      studentId: '',
      studentName: '',
      parentId: '',
      parentName: '',
      schoolId: '',
      schoolName: '',
    },
  });
  
  const onSubmit = async (data: PaymentFormValues) => {
    try {
      // Converte o valor para centavos
      const amount = Math.round(parseFloat(data.amount) * 100);
      
      // Adiciona informações de escola/estudante/responsável se fornecidas
      let additionalData = {};
      
      if (data.studentId) {
        const student = students.find(s => s.id === data.studentId);
        if (student) {
          additionalData = {
            studentId: student.id,
            studentName: student.name,
            parentId: student.parentId,
            parentName: student.parentName,
          };
        }
      } else if (data.schoolId) {
        const school = schools.find(s => s.id === data.schoolId);
        if (school) {
          additionalData = {
            schoolId: school.id,
            schoolName: school.name,
          };
        }
      }
      
      const paymentData: CreatePaymentData = {
        amount,
        description: data.description,
        method: data.method,
        dueDate: data.dueDate || undefined,
        ...additionalData
      };
      
      const payment = await paymentService.createPayment(paymentData);
      
      toast({
        title: "Pagamento criado com sucesso",
        description: `Pagamento ${payment.id} foi criado e está com status ${payment.status}`,
      });
      
      // Redireciona para a página de detalhes do pagamento
      navigate('/payment');
    } catch (error) {
      toast({
        title: "Erro ao criar pagamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao criar o pagamento",
        variant: "destructive"
      });
    }
  };
  
  // Atualiza informações do estudante quando selecionado
  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      form.setValue('studentName', student.name);
      form.setValue('parentId', student.parentId);
      form.setValue('parentName', student.parentName);
    }
  };
  
  // Atualiza informações da escola quando selecionada
  const handleSchoolChange = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    if (school) {
      form.setValue('schoolName', school.name);
    }
  };
  
  // Define o tipo de pagamento (escola ou estudante)
  const [paymentType, setPaymentType] = React.useState<'school' | 'student'>('school');
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/payment')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Novo Pagamento</h1>
            <p className="text-muted-foreground">Crie um novo pagamento no sistema</p>
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
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Informações do Pagamento</CardTitle>
                  </div>
                  <CardDescription>
                    Dados básicos do pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor (R$)</FormLabel>
                          <FormControl>
                            <Input placeholder="0,00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Método de Pagamento</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o método" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                              <SelectItem value="bank_slip">Boleto Bancário</SelectItem>
                              <SelectItem value="pix">PIX</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição do pagamento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Vencimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Opcional para pagamentos imediatos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Vinculação</CardTitle>
                  <CardDescription>
                    Vincule este pagamento a uma escola ou aluno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4 pb-4">
                    <Button
                      type="button"
                      variant={paymentType === 'school' ? "default" : "outline"}
                      onClick={() => setPaymentType('school')}
                    >
                      Escola
                    </Button>
                    <Button
                      type="button"
                      variant={paymentType === 'student' ? "default" : "outline"}
                      onClick={() => setPaymentType('student')}
                    >
                      Aluno
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {paymentType === 'school' ? (
                    <div className="pt-4">
                      <FormField
                        control={form.control}
                        name="schoolId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Escola</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleSchoolChange(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a escola" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {schools.map((school) => (
                                  <SelectItem key={school.id} value={school.id}>
                                    {school.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              O pagamento será vinculado a esta escola
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="pt-4">
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aluno</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleStudentChange(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o aluno" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {students.map((student) => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              O pagamento será vinculado a este aluno e seu responsável
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/payment')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Criar Pagamento
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Card lateral */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-500">Valor:</dt>
                  <dd className="font-medium text-lg">
                    {form.watch('amount') ? `R$ ${form.watch('amount')}` : 'R$ 0,00'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Método:</dt>
                  <dd>
                    {form.watch('method') === 'credit_card' && 'Cartão de Crédito'}
                    {form.watch('method') === 'bank_slip' && 'Boleto Bancário'}
                    {form.watch('method') === 'pix' && 'PIX'}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Descrição:</dt>
                  <dd>{form.watch('description') || '—'}</dd>
                </div>
                
                <Separator />
                
                {paymentType === 'school' ? (
                  <div>
                    <dt className="text-gray-500">Escola:</dt>
                    <dd>{form.watch('schoolName') || '—'}</dd>
                  </div>
                ) : (
                  <>
                    <div>
                      <dt className="text-gray-500">Aluno:</dt>
                      <dd>{form.watch('studentName') || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Responsável:</dt>
                      <dd>{form.watch('parentName') || '—'}</dd>
                    </div>
                  </>
                )}
                
                {form.watch('dueDate') && (
                  <div>
                    <dt className="text-gray-500">Vencimento:</dt>
                    <dd>{new Date(form.watch('dueDate')).toLocaleDateString('pt-BR')}</dd>
                  </div>
                )}
              </dl>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Após criar o pagamento, você poderá processá-lo, cancelá-lo ou reembolsá-lo conforme necessário.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

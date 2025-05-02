
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCcw,
  Ban,
  Users,
  Smartphone,
  BadgeDollarSign,
  BadgePercent,
  Plus,
  PencilLine,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { useToast } from '@/components/ui/use-toast';
import { subscriptions, plans, addPlan, updatePlan, PlanType } from '@/services/financialMockData';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';

// Schema para validação do formulário de planos
const planSchema = z.object({
  name: z.string().min(1, "Nome do plano é obrigatório"),
  pricePerStudent: z.number().min(1, "Preço por aluno deve ser maior que zero"),
  studentRange: z.string().min(1, "Faixa de alunos é obrigatória"),
  deviceLimit: z.number().min(1, "Limite de dispositivos deve ser maior que zero"),
  minStudents: z.number().min(0, "Quantidade mínima deve ser maior ou igual a zero"),
  maxStudents: z.number().nullable(),
  features: z.string().min(1, "Inclua pelo menos uma funcionalidade"),
  discountThreshold: z.number().nullable(),
  discountPercentage: z.number().min(0).max(100).nullable(),
});

type PlanFormValues = z.infer<typeof planSchema>;

export default function Subscriptions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false);
  const [isEditPlanDialogOpen, setIsEditPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  
  // Formulário para adicionar/editar planos
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      pricePerStudent: 0,
      studentRange: "",
      deviceLimit: 0,
      minStudents: 0,
      maxStudents: null,
      features: "",
      discountThreshold: null,
      discountPercentage: null,
    }
  });
  
  // Filtrar assinaturas com base no termo de busca
  const filteredSubscriptions = subscriptions.filter(subscription => 
    subscription.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Estatísticas
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const pastDueSubscriptions = subscriptions.filter(sub => sub.status === 'past_due').length;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const handleViewSubscription = (subscriptionId: string) => {
    navigate(`/financial/subscriptions/${subscriptionId}`);
  };
  
  const handleGenerateInvoice = (subscriptionId: string) => {
    toast({
      title: "Fatura gerada",
      description: `Uma nova fatura foi gerada para a assinatura ${subscriptionId}.`,
    });
    navigate('/financial/invoices/create');
  };
  
  const handleCancelSubscription = (subscriptionId: string) => {
    toast({
      title: "Cancelamento solicitado",
      description: `A solicitação de cancelamento para a assinatura ${subscriptionId} foi iniciada.`,
    });
  };

  const openAddPlanDialog = () => {
    form.reset({
      name: "",
      pricePerStudent: 0,
      studentRange: "",
      deviceLimit: 0,
      minStudents: 0,
      maxStudents: null,
      features: "",
      discountThreshold: null,
      discountPercentage: null,
    });
    setIsAddPlanDialogOpen(true);
  };

  const openEditPlanDialog = (plan: PlanType) => {
    setSelectedPlan(plan);
    form.reset({
      name: plan.name,
      pricePerStudent: plan.pricePerStudent,
      studentRange: plan.studentRange,
      deviceLimit: plan.deviceLimit,
      minStudents: plan.minStudents,
      maxStudents: plan.maxStudents,
      features: plan.features.join("\n"),
      discountThreshold: plan.discount?.threshold || null,
      discountPercentage: plan.discount?.percentage || null,
    });
    setIsEditPlanDialogOpen(true);
  };

  const handleAddPlan = (values: PlanFormValues) => {
    // Converter string de features para array
    const featuresArray = values.features.split("\n").filter(f => f.trim() !== "");
    
    // Criar objeto de desconto se houver threshold e percentagem
    const discount = values.discountThreshold && values.discountPercentage 
      ? { threshold: values.discountThreshold, percentage: values.discountPercentage } 
      : null;
    
    const newPlan = {
      name: values.name,
      pricePerStudent: values.pricePerStudent,
      studentRange: values.studentRange,
      deviceLimit: values.deviceLimit,
      minStudents: values.minStudents,
      maxStudents: values.maxStudents,
      discount,
      features: featuresArray
    };
    
    addPlan(newPlan);
    setIsAddPlanDialogOpen(false);
    
    toast({
      title: "Plano adicionado",
      description: `O plano ${values.name} foi adicionado com sucesso.`,
    });
  };

  const handleEditPlan = (values: PlanFormValues) => {
    if (!selectedPlan) return;
    
    // Converter string de features para array
    const featuresArray = values.features.split("\n").filter(f => f.trim() !== "");
    
    // Criar objeto de desconto se houver threshold e percentagem
    const discount = values.discountThreshold && values.discountPercentage 
      ? { threshold: values.discountThreshold, percentage: values.discountPercentage } 
      : null;
    
    const updatedPlan = {
      name: values.name,
      pricePerStudent: values.pricePerStudent,
      studentRange: values.studentRange,
      deviceLimit: values.deviceLimit,
      minStudents: values.minStudents,
      maxStudents: values.maxStudents,
      discount,
      features: featuresArray
    };
    
    updatePlan(selectedPlan.id, updatedPlan);
    setIsEditPlanDialogOpen(false);
    
    toast({
      title: "Plano atualizado",
      description: `O plano ${values.name} foi atualizado com sucesso.`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Ativa</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Em atraso</Badge>;
      case 'canceled':
        return <Badge variant="secondary">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'past_due':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'canceled':
        return <Ban className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };
  
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assinaturas</h1>
          <p className="text-muted-foreground">
            Gerencie os planos e assinaturas das escolas
          </p>
        </div>
        <Button onClick={openAddPlanDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar Plano
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assinaturas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagamentos Atrasados
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-2xl font-bold">{pastDueSubscriptions}</div>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardContent>
        </Card>
      </div>
      
      {/* Plans */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Planos disponíveis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan.id} className="relative overflow-hidden">
              {plan.discount && (
                <div className="absolute top-0 right-0">
                  <Badge variant="destructive" className="rounded-bl-md rounded-tr-md px-3 py-1">
                    <BadgePercent className="h-4 w-4 mr-1" />
                    {plan.discount.percentage}% off acima de {plan.discount.threshold} alunos
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {plan.studentRange}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditPlanDialog(plan)}>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Editar Plano
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Plano
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <BadgeDollarSign className="h-5 w-5 text-primary" />
                    <p className="text-2xl font-bold">
                      {formatCurrency(plan.pricePerStudent)} <span className="text-sm font-normal text-muted-foreground">/aluno/mês</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Smartphone className="h-4 w-4" />
                    Até {plan.deviceLimit} dispositivos
                  </div>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Assinaturas</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por escola, plano ou ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Button variant="outline" className="w-full gap-1">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Escola</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Renovação</TableHead>
                <TableHead>Valor Mensal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.id}</TableCell>
                  <TableCell>{subscription.schoolName}</TableCell>
                  <TableCell>{subscription.plan}</TableCell>
                  <TableCell>{new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{formatCurrency(subscription.monthlyFee)}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {getStatusIcon(subscription.status)}
                    {getStatusBadge(subscription.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewSubscription(subscription.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGenerateInvoice(subscription.id)}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Gerar Fatura
                        </DropdownMenuItem>
                        {subscription.status === 'active' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-500"
                              onClick={() => handleCancelSubscription(subscription.id)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Cancelar Assinatura
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog para adicionar plano */}
      <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar novo plano</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para criar um novo plano de assinatura.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddPlan)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do plano</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Premium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerStudent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço por aluno (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="Ex: 15.00" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faixa de alunos (descrição)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Até 1000 alunos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deviceLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de dispositivos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 30" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade mínima de alunos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 1" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade máxima de alunos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Deixe vazio para ilimitado" 
                          value={field.value === null ? "" : field.value}
                          onChange={e => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Deixe vazio para quantidade ilimitada</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite para desconto (alunos)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 900" 
                          value={field.value === null ? "" : field.value}
                          onChange={e => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Quantidade de alunos acima da qual se aplica o desconto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentual de desconto (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 5" 
                          value={field.value === null ? "" : field.value}
                          onChange={e => {
                            const value = e.target.value === "" ? null : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                          min="0"
                          max="100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funcionalidades (uma por linha)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ex: Até 1000 alunos&#10;Até 30 dispositivos&#10;Suporte prioritário" 
                        {...field} 
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>Liste as funcionalidades incluídas neste plano, uma por linha</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddPlanDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar Plano</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para editar plano */}
      <Dialog open={isEditPlanDialogOpen} onOpenChange={setIsEditPlanDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar plano</DialogTitle>
            <DialogDescription>
              Altere os detalhes do plano de assinatura.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditPlan)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do plano</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Premium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerStudent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço por aluno (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="Ex: 15.00" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faixa de alunos (descrição)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Até 1000 alunos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deviceLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de dispositivos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 30" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade mínima de alunos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 1" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade máxima de alunos</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Deixe vazio para ilimitado" 
                          value={field.value === null ? "" : field.value}
                          onChange={e => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Deixe vazio para quantidade ilimitada</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discountThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite para desconto (alunos)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 900" 
                          value={field.value === null ? "" : field.value}
                          onChange={e => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Quantidade de alunos acima da qual se aplica o desconto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentual de desconto (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex: 5" 
                          value={field.value === null ? "" : field.value}
                          onChange={e => {
                            const value = e.target.value === "" ? null : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                          min="0"
                          max="100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funcionalidades (uma por linha)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ex: Até 1000 alunos&#10;Até 30 dispositivos&#10;Suporte prioritário" 
                        {...field} 
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>Liste as funcionalidades incluídas neste plano, uma por linha</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditPlanDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Atualizar Plano</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

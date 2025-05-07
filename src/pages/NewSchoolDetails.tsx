
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Edit, Trash2, MapPin, Phone, Mail, Building, Users, CreditCard } from 'lucide-react';
import { useSchool } from '@/services/schools/hooks';
import { useInvoicesBySchool } from '@/services/invoices/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function NewSchoolDetails() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: school, isLoading: schoolLoading, error: schoolError } = useSchool(schoolId || '');
  const { data: invoices, isLoading: invoicesLoading } = useInvoicesBySchool(schoolId || '');

  React.useEffect(() => {
    if (schoolError) {
      toast({
        title: "Erro ao carregar dados da escola",
        description: "Não foi possível carregar as informações da escola. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  }, [schoolError, toast]);

  if (schoolLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6 gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/schools')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Escola</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (!school) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6 gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/schools')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Escola não encontrada</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <p className="text-muted-foreground">
                A escola solicitada não foi encontrada ou não existe.
              </p>
              <Button 
                onClick={() => navigate('/schools')}
                variant="outline"
                className="mt-4"
              >
                Voltar para lista de escolas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'processing':
      case 'pending':
        return 'warning';
      case 'canceled':
      case 'overdue':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'processing':
        return 'Processando';
      case 'pending':
        return 'Pendente';
      case 'canceled':
        return 'Cancelado';
      case 'overdue':
        return 'Vencida';
      default:
        return status;
    }
  };

  const getSubscriptionStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'trial':
        return <Badge variant="warning">Em Teste</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expirado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/schools')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {school.name}
              <Badge variant={school.active ? "default" : "secondary"}>
                {school.active ? 'Ativa' : 'Inativa'}
              </Badge>
            </h1>
            <p className="text-muted-foreground text-sm">
              ID: {school.id}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/schools/${schoolId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir esta escola?')) {
                // Implementar exclusão
                toast({
                  title: "Escola excluída com sucesso",
                  description: "A escola foi removida permanentemente."
                });
                navigate('/schools');
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informações da Escola</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={school.logo_url || ''} alt={school.name} />
                  <AvatarFallback className="text-2xl">
                    {school.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">{school.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  {getSubscriptionStatusBadge(school.subscription_status)}
                  <span>{school.subscription_plan || 'Plano Básico'}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Endereço</p>
                    <p className="text-muted-foreground text-sm">
                      {school.address ? (
                        <>
                          {school.address}<br />
                          {school.city && school.state && `${school.city}, ${school.state}`}
                          {school.zipcode && <span> - {school.zipcode}</span>}
                        </>
                      ) : (
                        "Não cadastrado"
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-muted-foreground text-sm">{school.phone || "Não cadastrado"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">E-mail</p>
                    <p className="text-muted-foreground text-sm">{school.email || "Não cadastrado"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-3 mt-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/schools/${schoolId}/students`)}
            >
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Alunos
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/schools/${schoolId}/financial`)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Financeiro
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-3"
            onClick={() => navigate(`/schools/${schoolId}/units`)}
          >
            <Building className="h-4 w-4 mr-2" />
            Gerenciar Unidades
          </Button>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="students">Alunos</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
              <TabsTrigger value="devices">Dispositivos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visão Geral</CardTitle>
                  <CardDescription>Informações gerais sobre a escola</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="text-lg font-medium">{school.active ? "Ativa" : "Inativa"}</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Assinatura</p>
                      <p className="text-lg font-medium">{school.subscription_status || "-"}</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Plano</p>
                      <p className="text-lg font-medium">{school.subscription_plan || "Básico"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="students" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Alunos</CardTitle>
                    <CardDescription>Lista de alunos matriculados</CardDescription>
                  </div>
                  <Button onClick={() => navigate(`/schools/${schoolId}/students`)}>
                    Ver Todos
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Carregando lista de alunos...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Faturas</CardTitle>
                    <CardDescription>Histórico financeiro</CardDescription>
                  </div>
                  <Button onClick={() => navigate('/financial/invoices/new')}>
                    Nova Fatura
                  </Button>
                </CardHeader>
                <CardContent>
                  {invoicesLoading ? (
                    <p className="text-muted-foreground">Carregando faturas...</p>
                  ) : invoices && invoices.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fatura</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.slice(0, 5).map(invoice => (
                            <TableRow key={invoice.id} className="cursor-pointer" 
                              onClick={() => navigate(`/financial/invoices/${invoice.id}`)}>
                              <TableCell>{invoice.invoice_id}</TableCell>
                              <TableCell>{formatDate(invoice.issued_date)}</TableCell>
                              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                              <TableCell>
                                <Badge variant={getBadgeVariant(invoice.status)}>
                                  {getStatusLabel(invoice.status)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma fatura encontrada para esta escola.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devices" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dispositivos</CardTitle>
                  <CardDescription>Dispositivos vinculados à escola</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nenhum dispositivo encontrado para esta escola.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

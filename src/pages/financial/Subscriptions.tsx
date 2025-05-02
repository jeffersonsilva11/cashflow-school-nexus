
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
  BadgePercent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { useToast } from '@/components/ui/use-toast';
import { subscriptions, plans } from '@/services/financialMockData';

export default function Subscriptions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
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
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {plan.studentRange}
              </CardDescription>
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
    </div>
  );
}

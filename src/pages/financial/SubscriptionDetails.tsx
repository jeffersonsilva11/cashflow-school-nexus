
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Ban,
  Calendar,
  CreditCard,
  BarChart3,
  RefreshCcw,
  FileText,
  School
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { subscriptions, invoices } from '@/services/financialMockData';

export default function SubscriptionDetails() {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Encontrar a assinatura com base no ID
  const subscription = subscriptions.find(sub => sub.id === subscriptionId);
  
  // Filtrar faturas relacionadas à escola desta assinatura
  const relatedInvoices = subscription 
    ? invoices.filter(inv => inv.schoolId === subscription.schoolId)
    : [];
  
  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-2">Assinatura não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          A assinatura com ID {subscriptionId} não foi encontrada.
        </p>
        <Button onClick={() => navigate('/financial/subscriptions')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Assinaturas
        </Button>
      </div>
    );
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativa',
          color: 'bg-green-500',
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
        };
      case 'past_due':
        return {
          label: 'Em atraso',
          color: 'bg-red-500',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        };
      case 'canceled':
        return {
          label: 'Cancelada',
          color: 'bg-gray-500',
          icon: <Ban className="h-5 w-5 text-gray-500" />
        };
      default:
        return {
          label: status,
          color: 'bg-gray-500',
          icon: <Clock className="h-5 w-5 text-amber-500" />
        };
    }
  };
  
  const statusDetails = getStatusDetails(subscription.status);
  
  const handleGenerateInvoice = () => {
    toast({
      title: "Fatura gerada",
      description: `Uma nova fatura foi gerada para ${subscription.schoolName}.`,
    });
    navigate('/financial/invoices/create');
  };
  
  const handleChangePlan = () => {
    toast({
      title: "Alteração de plano",
      description: "Funcionalidade de alteração de plano será implementada em breve.",
    });
  };
  
  const handleCancelSubscription = () => {
    toast({
      title: "Cancelamento solicitado",
      description: `A solicitação de cancelamento para a assinatura ${subscription.id} foi iniciada.`,
    });
  };
  
  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/financial/invoices/${invoiceId}`);
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/financial/subscriptions')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assinatura {subscription.id}</h1>
            <p className="text-muted-foreground">
              {subscription.schoolName} - {subscription.plan}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleChangePlan}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Alterar Plano
          </Button>
          <Button onClick={handleGenerateInvoice}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Fatura
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <School className="h-4 w-4" />
              Escola
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{subscription.schoolName}</div>
            <div className="text-muted-foreground text-sm">ID: {subscription.schoolId}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Início</div>
                <div className="font-medium">{new Date(subscription.startDate).toLocaleDateString('pt-BR')}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Próximo Faturamento</div>
                <div className="font-medium">{new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{subscription.plan}</div>
            <div className="text-muted-foreground text-sm">{formatCurrency(subscription.monthlyFee)}/mês</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {statusDetails.icon}
              <Badge className={statusDetails.color}>{statusDetails.label}</Badge>
            </div>
            <div className="text-sm mt-2">
              {subscription.status === 'active' && 'Assinatura ativa e recorrente'}
              {subscription.status === 'past_due' && 'Pagamento pendente'}
              {subscription.status === 'canceled' && 'Assinatura cancelada'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Assinatura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Informações do Plano</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plano:</span>
                  <span className="font-medium">{subscription.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor mensal:</span>
                  <span className="font-medium">{formatCurrency(subscription.monthlyFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de início:</span>
                  <span className="font-medium">{new Date(subscription.startDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Período atual:</span>
                  <span className="font-medium">
                    {new Date(subscription.currentPeriodStart).toLocaleDateString('pt-BR')} a{' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Forma de Pagamento</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método:</span>
                  <span className="font-medium">{subscription.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renovação automática:</span>
                  <span className="font-medium">{subscription.autoRenew ? 'Sim' : 'Não'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Próximo faturamento:</span>
                  <span className="font-medium">{new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-4">Faturas Relacionadas</h3>
            {relatedInvoices.length > 0 ? (
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Data de Emissão</th>
                      <th className="px-4 py-3 text-left">Vencimento</th>
                      <th className="px-4 py-3 text-right">Valor</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{invoice.id}</td>
                        <td className="px-4 py-3">{new Date(invoice.issuedDate).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(invoice.amount)}</td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant={
                              invoice.status === 'paid' ? 'default' : 
                              invoice.status === 'pending' ? 'outline' : 
                              'destructive'
                            }
                            className={invoice.status === 'paid' ? 'bg-green-500' : ''}
                          >
                            {invoice.status === 'paid' ? 'Pago' : 
                            invoice.status === 'pending' ? 'Pendente' : 
                            'Em atraso'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewInvoice(invoice.id)}
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4 bg-muted rounded-md">
                <p className="text-muted-foreground">Nenhuma fatura encontrada para esta assinatura.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
          <CardDescription>Opções disponíveis para esta assinatura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleGenerateInvoice}>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Fatura Manual
            </Button>
            <Button variant="outline" onClick={handleChangePlan}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Alterar Plano
            </Button>
            {subscription.status === 'active' && (
              <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10" onClick={handleCancelSubscription}>
                <Ban className="mr-2 h-4 w-4" />
                Cancelar Assinatura
              </Button>
            )}
          </div>
          
          {subscription.status === 'active' && (
            <p className="text-sm text-muted-foreground">
              O cancelamento será efetivado ao final do período atual. Não serão feitas cobranças adicionais após essa data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

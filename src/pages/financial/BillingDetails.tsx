
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Send, 
  FileText, 
  Printer,
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building,
  CalendarClock,
  Receipt,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { invoices } from '@/services/financialMockData';

export default function BillingDetails() {
  const { billingId } = useParams<{ billingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Encontrar a cobrança com base no ID (usando invoices como fonte dos dados)
  const billing = invoices.find(inv => inv.id === billingId);
  
  if (!billing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-2">Cobrança não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          A cobrança com ID {billingId} não foi encontrada.
        </p>
        <Button onClick={() => navigate('/financial/billing')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Cobranças
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
      case 'paid':
        return {
          label: 'Pago',
          color: 'bg-green-500',
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
        };
      case 'pending':
        return {
          label: 'Pendente',
          color: 'bg-yellow-500',
          icon: <Clock className="h-5 w-5 text-amber-500" />
        };
      case 'overdue':
        return {
          label: 'Em atraso',
          color: 'bg-red-500',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        };
      default:
        return {
          label: status,
          color: 'bg-gray-500',
          icon: null
        };
    }
  };
  
  const statusDetails = getStatusDetails(billing.status);
  
  const handleSendReminder = () => {
    toast({
      title: "Lembrete enviado",
      description: `Um lembrete de pagamento foi enviado para ${billing.schoolName}.`,
    });
  };
  
  const handlePrintBilling = () => {
    toast({
      title: "Preparando impressão",
      description: "O documento de cobrança está sendo preparado para impressão.",
    });
  };
  
  const handleDownloadInvoice = () => {
    toast({
      title: "Download iniciado",
      description: `Baixando a fatura ${billing.id} em PDF.`,
    });
  };
  
  const handleMarkAsPaid = () => {
    toast({
      title: "Status atualizado",
      description: `A cobrança ${billing.id} foi marcada como paga.`,
    });
  };
  
  // Determinar se a cobrança está vencida
  const isOverdue = billing.status === 'overdue' || 
    (billing.status === 'pending' && new Date(billing.dueDate) < new Date());
  
  // Calcular dias em atraso
  const calculateDaysOverdue = () => {
    if (!isOverdue) return 0;
    
    const dueDate = new Date(billing.dueDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysOverdue = calculateDaysOverdue();
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/financial/billing')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cobrança {billing.id}</h1>
            <p className="text-muted-foreground">
              {billing.schoolName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintBilling}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          {(billing.status === 'pending' || billing.status === 'overdue') && (
            <>
              <Button variant="outline" onClick={handleSendReminder}>
                <Send className="mr-2 h-4 w-4" />
                Enviar Lembrete
              </Button>
              <Button onClick={handleMarkAsPaid}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Marcar como Pago
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building className="h-4 w-4" />
              Escola
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{billing.schoolName}</div>
            <div className="text-muted-foreground text-sm">ID: {billing.schoolId}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Datas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Emissão</div>
                <div className="font-medium">{new Date(billing.issuedDate).toLocaleDateString('pt-BR')}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Vencimento</div>
                <div className="font-medium">{new Date(billing.dueDate).toLocaleDateString('pt-BR')}</div>
              </div>
              {billing.paidDate && (
                <div>
                  <div className="text-xs text-muted-foreground">Pagamento</div>
                  <div className="font-medium">{new Date(billing.paidDate).toLocaleDateString('pt-BR')}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {statusDetails.icon}
              <Badge className={statusDetails.color}>{statusDetails.label}</Badge>
            </div>
            {billing.status === 'paid' && (
              <div className="text-sm mt-2 text-green-600">
                Pago em {new Date(billing.paidDate!).toLocaleDateString('pt-BR')}
              </div>
            )}
            {billing.status === 'pending' && !isOverdue && (
              <div className="text-sm mt-2">
                Aguardando pagamento até {new Date(billing.dueDate).toLocaleDateString('pt-BR')}
              </div>
            )}
            {isOverdue && (
              <div className="text-sm mt-2 text-red-500">
                Vencido há {daysOverdue} dias
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Cobrança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Itens</h3>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left">Descrição</th>
                      <th className="px-4 py-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billing.items.map((item, index) => (
                      <tr key={index} className={index !== billing.items.length - 1 ? "border-b" : ""}>
                        <td className="px-4 py-3">{item.description}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {isOverdue && (
              <>
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">Situação de Atraso</h3>
                  <p className="text-sm mb-2">
                    Esta cobrança está em atraso há {daysOverdue} dias. Entre em contato com a escola para regularização.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Multa por atraso:</span>
                    <span className="font-medium">{formatCurrency(billing.amount * 0.02)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Juros diários:</span>
                    <span className="font-medium">{formatCurrency(billing.amount * 0.001 * daysOverdue)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Valor total com juros:</span>
                    <span>{formatCurrency(
                      billing.amount + (billing.amount * 0.02) + (billing.amount * 0.001 * daysOverdue)
                    )}</span>
                  </div>
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div className="font-medium text-lg">Total</div>
              <div className="font-bold text-xl">{formatCurrency(billing.amount)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {billing.status !== 'paid' && (
        <Card>
          <CardHeader>
            <CardTitle>Informações para Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Métodos de Pagamento Aceitos</h3>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="font-semibold mb-1">Dados para transferência</div>
              <p className="text-sm">Banco: 001 - Banco do Brasil</p>
              <p className="text-sm">Agência: 1234-5</p>
              <p className="text-sm">Conta: 67890-1</p>
              <p className="text-sm">Favorecido: CashFlow School Nexus LTDA</p>
              <p className="text-sm">CNPJ: 12.345.678/0001-90</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
              <div className="font-semibold mb-1 text-green-700 dark:text-green-300">Pagamento via PIX</div>
              <p className="text-sm">Chave PIX: 12.345.678/0001-90 (CNPJ)</p>
              <p className="text-sm mt-2">Após o pagamento, envie o comprovante para financeiro@cashflowschool.com</p>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" onClick={handleDownloadInvoice} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Baixar Boleto/Fatura
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

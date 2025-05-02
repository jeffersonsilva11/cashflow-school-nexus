
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Send, 
  ChevronLeft, 
  Printer, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Calendar,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { invoices } from '@/services/financialMockData';

export default function InvoiceDetails() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Encontrar a fatura com base no ID
  const invoice = invoices.find(inv => inv.id === invoiceId);
  
  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-2">Fatura não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          A fatura com ID {invoiceId} não foi encontrada.
        </p>
        <Button onClick={() => navigate('/financial/invoices')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Faturas
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
  
  const statusDetails = getStatusDetails(invoice.status);
  
  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: `Baixando fatura ${invoice.id} em PDF.`,
    });
  };
  
  const handlePrint = () => {
    toast({
      title: "Preparando impressão",
      description: "Preparando documento para impressão...",
    });
    // Em uma implementação real, aqui chamaria window.print()
  };
  
  const handleSendEmail = () => {
    toast({
      title: "Fatura enviada",
      description: `A fatura ${invoice.id} foi enviada por e-mail para ${invoice.schoolName}.`,
    });
  };
  
  const handleMarkAsPaid = () => {
    toast({
      title: "Status atualizado",
      description: `A fatura ${invoice.id} foi marcada como paga.`,
    });
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/financial/invoices')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fatura {invoice.id}</h1>
            <p className="text-muted-foreground">
              {invoice.schoolName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Send className="mr-2 h-4 w-4" />
            Enviar
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          {(invoice.status === 'pending' || invoice.status === 'overdue') && (
            <Button onClick={handleMarkAsPaid}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Marcar como Pago
            </Button>
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
            <div className="font-medium">{invoice.schoolName}</div>
            <div className="text-muted-foreground text-sm">ID: {invoice.schoolId}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Datas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Emissão</div>
                <div className="font-medium">{new Date(invoice.issuedDate).toLocaleDateString('pt-BR')}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Vencimento</div>
                <div className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</div>
              </div>
              {invoice.paidDate && (
                <div>
                  <div className="text-xs text-muted-foreground">Pagamento</div>
                  <div className="font-medium">{new Date(invoice.paidDate).toLocaleDateString('pt-BR')}</div>
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
            <div className="text-sm mt-2">
              {invoice.status === 'paid' && `Pago em ${new Date(invoice.paidDate!).toLocaleDateString('pt-BR')}`}
              {invoice.status === 'pending' && `Aguardando pagamento até ${new Date(invoice.dueDate).toLocaleDateString('pt-BR')}`}
              {invoice.status === 'overdue' && `Vencido desde ${new Date(invoice.dueDate).toLocaleDateString('pt-BR')}`}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Fatura</CardTitle>
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
                    {invoice.items.map((item, index) => (
                      <tr key={index} className={index !== invoice.items.length - 1 ? "border-b" : ""}>
                        <td className="px-4 py-3">{item.description}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div className="font-medium text-lg">Total</div>
              <div className="font-bold text-xl">{formatCurrency(invoice.amount)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Aqui viriam as informações de pagamento como chave PIX, boleto, etc. */}
          <p className="text-muted-foreground text-sm">O pagamento deve ser realizado até a data de vencimento. Em caso de dúvidas, entre em contato com nosso suporte financeiro.</p>
          
          <div className="bg-muted p-4 rounded-md">
            <div className="font-semibold mb-1">Dados para pagamento</div>
            <p className="text-sm">Banco: 001 - Banco do Brasil</p>
            <p className="text-sm">Agência: 1234-5</p>
            <p className="text-sm">Conta: 67890-1</p>
            <p className="text-sm">Favorecido: CashFlow School Nexus LTDA</p>
            <p className="text-sm">CNPJ: 12.345.678/0001-90</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
            <div className="font-semibold mb-1 text-green-700 dark:text-green-300">Chave PIX</div>
            <p className="text-sm">CNPJ: 12.345.678/0001-90</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

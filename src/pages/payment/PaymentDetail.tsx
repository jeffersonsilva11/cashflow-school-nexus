
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PaymentInfo, paymentService } from '@/services/paymentService';
import { ArrowLeft, Download, Printer, RefreshCcw, User, School, CreditCard, FileText, Share, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PaymentDetail() {
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();
  const { toast } = useToast();
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  useEffect(() => {
    if (paymentId) {
      loadPayment();
    }
  }, [paymentId]);

  const loadPayment = async () => {
    if (!paymentId) return;
    
    try {
      setLoading(true);
      const data = await paymentService.getPayment(paymentId);
      
      if (!data) {
        toast({
          title: "Pagamento não encontrado",
          description: `Não foi possível encontrar o pagamento com ID ${paymentId}`,
          variant: "destructive"
        });
        navigate('/payment');
        return;
      }
      
      setPayment(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar pagamento",
        description: "Ocorreu um problema ao buscar os dados do pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!payment) return;
    
    try {
      const result = await paymentService.processPayment(payment.id);
      
      if (result.status === 'paid') {
        toast({
          title: "Pagamento processado com sucesso",
          description: `O pagamento ${payment.id} foi concluído com sucesso`,
        });
      } else {
        toast({
          title: "Falha no processamento",
          description: `O pagamento ${payment.id} falhou. Por favor, tente novamente`,
          variant: "destructive"
        });
      }
      
      // Atualiza os dados do pagamento
      loadPayment();
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar o pagamento",
        variant: "destructive"
      });
    }
  };

  const handleCancelPayment = async () => {
    if (!payment) return;
    
    try {
      await paymentService.cancelPayment(payment.id);
      
      toast({
        title: "Pagamento cancelado",
        description: `O pagamento ${payment.id} foi cancelado com sucesso`,
      });
      
      // Atualiza os dados do pagamento
      loadPayment();
    } catch (error) {
      toast({
        title: "Erro ao cancelar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao cancelar o pagamento",
        variant: "destructive"
      });
    }
  };

  const handleRefundPayment = async () => {
    if (!payment) return;
    
    try {
      await paymentService.refundPayment(payment.id);
      
      toast({
        title: "Reembolso realizado",
        description: `O pagamento ${payment.id} foi reembolsado com sucesso`,
      });
      
      // Atualiza os dados do pagamento
      loadPayment();
    } catch (error) {
      toast({
        title: "Erro no reembolso",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao reembolsar o pagamento",
        variant: "destructive"
      });
    }
  };

  const handleGenerateReceipt = async () => {
    if (!payment || payment.status !== 'paid') return;
    
    try {
      setGeneratingReceipt(true);
      const receipt = await paymentService.generateReceipt(payment.id);
      
      if (receipt && receipt.url) {
        setReceiptUrl(receipt.url);
        setShowReceiptDialog(true);
        
        toast({
          title: "Recibo gerado",
          description: "O recibo foi gerado com sucesso e está pronto para download",
        });
      } else {
        toast({
          title: "Erro ao gerar recibo",
          description: "Não foi possível gerar o recibo para este pagamento",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao gerar recibo",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o recibo",
        variant: "destructive"
      });
    } finally {
      setGeneratingReceipt(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Em um cenário real, isso faria o download do arquivo
    toast({
      title: "Download iniciado",
      description: "O recibo está sendo baixado",
    });
    
    setTimeout(() => {
      setShowReceiptDialog(false);
    }, 1000);
  };

  const handleShareReceipt = () => {
    // Em um cenário real, isto abriria um diálogo de compartilhamento
    toast({
      title: "Compartilhar recibo",
      description: "Opções de compartilhamento de recibo disponíveis",
    });
  };

  const getStatusBadge = (status: PaymentInfo['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pago</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Falha</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Reembolsado</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <p className="text-muted-foreground">Carregando dados do pagamento...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex justify-center items-center py-24">
        <p className="text-muted-foreground">Pagamento não encontrado</p>
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
            onClick={() => navigate('/payment')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Pagamento {payment.id}</h1>
              {getStatusBadge(payment.status)}
            </div>
            <p className="text-muted-foreground">Detalhes do pagamento e ações disponíveis</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPayment} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </Button>
          
          {payment.status === 'paid' && (
            <>
              <Button variant="outline" className="gap-2" onClick={handleGenerateReceipt} disabled={generatingReceipt}>
                <FileText className="h-4 w-4" />
                {generatingReceipt ? 'Gerando...' : 'Gerar Recibo'}
              </Button>
              
              <Button variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
            </>
          )}
        </div>
      </div>
      
      {payment.status === 'paid' && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">Pagamento confirmado</AlertTitle>
          <AlertDescription className="text-green-600">
            Este pagamento foi processado com sucesso e está confirmado.
            {payment.paidAt && ` Data de confirmação: ${formatDate(payment.paidAt)}`}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Detalhes principais */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                Detalhes do Pagamento
              </CardTitle>
              <CardDescription>
                Informações detalhadas sobre este pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">ID do Pagamento</p>
                  <p className="text-lg font-mono">{payment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(payment.status)}
                    {payment.status === 'paid' && (
                      <span className="text-sm text-green-600">
                        Pago em {formatDate(payment.paidAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Descrição</p>
                <p className="text-base">{payment.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Valor</p>
                  <p className="text-2xl font-bold">{formatCurrency(payment.amount / 100)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Método de Pagamento</p>
                  <p className="text-base">
                    {payment.method === 'credit_card' && 'Cartão de Crédito'}
                    {payment.method === 'bank_slip' && 'Boleto Bancário'}
                    {payment.method === 'pix' && 'PIX'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Data de Criação</p>
                  <p className="text-base">{formatDate(payment.createdAt)}</p>
                </div>
                {payment.dueDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Data de Vencimento</p>
                    <p className="text-base">{formatDate(payment.dueDate)}</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {payment.studentId ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Vinculado a Aluno</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Aluno</p>
                      <p className="text-base">{payment.studentName || '—'}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {payment.studentId}</p>
                    </div>
                    {payment.parentName && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Responsável</p>
                        <p className="text-base">{payment.parentName}</p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {payment.parentId}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : payment.schoolId ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <School className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Vinculado a Escola</h3>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Escola</p>
                    <p className="text-base">{payment.schoolName || '—'}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: {payment.schoolId}</p>
                  </div>
                </div>
              ) : null}
              
              {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Informações Adicionais</p>
                  <div className="bg-gray-50 p-3 rounded-md border text-sm">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(payment.metadata, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
            {(payment.status === 'pending' || payment.status === 'paid') && (
              <CardFooter className="flex justify-between border-t pt-6">
                {payment.status === 'pending' ? (
                  <>
                    <Button variant="outline" onClick={handleCancelPayment} className="gap-2">
                      Cancelar Pagamento
                    </Button>
                    <Button onClick={handleProcessPayment} className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      Processar Pagamento
                    </Button>
                  </>
                ) : payment.status === 'paid' ? (
                  <Button variant="outline" onClick={handleRefundPayment} className="gap-2 ml-auto">
                    Reembolsar Pagamento
                  </Button>
                ) : null}
              </CardFooter>
            )}
          </Card>
          
          {/* Histórico de transações - Em um sistema real, isto mostraria um log de eventos */}
          {payment.status === 'paid' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico de Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 border-l-4 border-green-500 bg-green-50 pl-4">
                    <div>
                      <p className="font-medium">Pagamento confirmado</p>
                      <p className="text-sm text-muted-foreground">Transação processada com sucesso</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{formatDate(payment.paidAt || '')}</p>
                      <p className="text-sm font-medium text-green-600">{formatCurrency(payment.amount / 100)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border-l-4 border-blue-500 bg-blue-50 pl-4">
                    <div>
                      <p className="font-medium">Pagamento iniciado</p>
                      <p className="text-sm text-muted-foreground">Transação iniciada via {payment.method === 'credit_card' ? 'cartão de crédito' : payment.method === 'bank_slip' ? 'boleto' : 'PIX'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
                      <p className="text-sm font-medium">{formatCurrency(payment.amount / 100)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Card lateral */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status do Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className={`p-3 rounded-md ${
                  payment.status === 'paid' ? 'bg-green-50 border border-green-100' :
                  payment.status === 'pending' ? 'bg-yellow-50 border border-yellow-100' :
                  payment.status === 'failed' ? 'bg-red-50 border border-red-100' :
                  payment.status === 'refunded' ? 'bg-blue-50 border border-blue-100' :
                  'bg-gray-50 border border-gray-100'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {payment.status === 'paid' ? 'Pagamento Concluído' :
                       payment.status === 'pending' ? 'Aguardando Pagamento' :
                       payment.status === 'failed' ? 'Pagamento Falhou' :
                       payment.status === 'refunded' ? 'Pagamento Reembolsado' :
                       'Pagamento Cancelado'}
                    </span>
                    {getStatusBadge(payment.status)}
                  </div>
                  
                  {payment.status === 'pending' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Este pagamento está pendente e aguardando processamento.
                    </p>
                  )}
                  
                  {payment.status === 'paid' && payment.paidAt && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Pago em {formatDate(payment.paidAt)}
                    </p>
                  )}
                  
                  {payment.status === 'failed' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      O processamento deste pagamento falhou. Tente novamente.
                    </p>
                  )}
                </div>
                
                {payment.status === 'pending' && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Você pode processar este pagamento agora ou aguardar até a data de vencimento.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payment.status === 'pending' && (
                <>
                  <Button onClick={handleProcessPayment} className="w-full gap-2">
                    <CreditCard className="h-4 w-4" />
                    Processar Pagamento
                  </Button>
                  <Button variant="outline" onClick={handleCancelPayment} className="w-full">
                    Cancelar Pagamento
                  </Button>
                </>
              )}
              
              {payment.status === 'paid' && (
                <>
                  <Button 
                    variant="default" 
                    className="w-full gap-2" 
                    onClick={handleGenerateReceipt} 
                    disabled={generatingReceipt}
                  >
                    <FileText className="h-4 w-4" />
                    {generatingReceipt ? 'Gerando recibo...' : 'Gerar Recibo'}
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir Comprovante
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Share className="h-4 w-4" />
                    Compartilhar
                  </Button>
                  <Separator />
                  <Button variant="outline" onClick={handleRefundPayment} className="w-full">
                    Reembolsar Pagamento
                  </Button>
                </>
              )}
              
              {['failed', 'canceled', 'refunded'].includes(payment.status) && (
                <Button variant="outline" className="w-full gap-2" onClick={() => navigate('/payment/new')}>
                  Criar Novo Pagamento
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Diálogo de recibo */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recibo de Pagamento</DialogTitle>
            <DialogDescription>
              O recibo do pagamento {payment.id} está disponível para download.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="border-2 border-dashed border-green-300 rounded-lg p-8 bg-green-50 flex flex-col items-center">
              <FileText className="w-12 h-12 text-green-600 mb-2" />
              <p className="text-lg font-medium mb-1">Recibo #{payment.id}</p>
              <p className="text-sm text-muted-foreground mb-3">Gerado em {formatDate(new Date().toISOString())}</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(payment.amount / 100)}</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => handleShareReceipt()}>
              <Share className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            <Button onClick={() => handleDownloadReceipt()}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

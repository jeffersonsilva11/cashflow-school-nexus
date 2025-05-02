
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentInfo, paymentService } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, CreditCard, FileText, Filter, Plus, RefreshCcw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PaymentManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      
      // Define filtros baseados no papel do usuário
      let filters = {};
      if (user?.role === 'school_admin') {
        filters = { schoolId: user.schoolId };
      } else if (user?.role === 'parent') {
        filters = { parentId: user.id };
      }
      
      const data = await paymentService.listPayments(filters);
      setPayments(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar pagamentos",
        description: "Ocorreu um erro ao buscar os dados de pagamentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (paymentId: string) => {
    try {
      const result = await paymentService.processPayment(paymentId);
      
      if (result.status === 'paid') {
        toast({
          title: "Pagamento processado com sucesso",
          description: `O pagamento ${paymentId} foi concluído com sucesso`,
        });
      } else {
        toast({
          title: "Falha no processamento",
          description: `O pagamento ${paymentId} falhou. Por favor, tente novamente`,
          variant: "destructive"
        });
      }
      
      // Atualiza a lista de pagamentos
      await loadPayments();
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar o pagamento",
        variant: "destructive"
      });
    }
  };

  const handleCancelPayment = async (paymentId: string) => {
    try {
      await paymentService.cancelPayment(paymentId);
      
      toast({
        title: "Pagamento cancelado",
        description: `O pagamento ${paymentId} foi cancelado com sucesso`,
      });
      
      // Atualiza a lista de pagamentos
      await loadPayments();
    } catch (error) {
      toast({
        title: "Erro ao cancelar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao cancelar o pagamento",
        variant: "destructive"
      });
    }
  };

  const handleRefundPayment = async (paymentId: string) => {
    try {
      await paymentService.refundPayment(paymentId);
      
      toast({
        title: "Reembolso realizado",
        description: `O pagamento ${paymentId} foi reembolsado com sucesso`,
      });
      
      // Atualiza a lista de pagamentos
      await loadPayments();
    } catch (error) {
      toast({
        title: "Erro no reembolso",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao reembolsar o pagamento",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: PaymentInfo['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pago</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Falha</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reembolsado</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodBadge = (method: PaymentInfo['method']) => {
    switch (method) {
      case 'credit_card':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Cartão de Crédito</Badge>;
      case 'bank_slip':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Boleto</Badge>;
      case 'pix':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">PIX</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  // Filtra pagamentos com base na tab ativa
  const filteredPayments = payments.filter(payment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return payment.status === 'pending';
    if (activeTab === 'paid') return payment.status === 'paid';
    if (activeTab === 'failed') return payment.status === 'failed';
    if (activeTab === 'others') {
      return payment.status === 'refunded' || payment.status === 'canceled';
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Pagamentos</h1>
            <p className="text-muted-foreground">Gerencie pagamentos de escolas e recargas de cantina</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPayments} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          
          <Button className="gap-2" onClick={() => navigate('/payment/new')}>
            <Plus className="h-4 w-4" />
            Novo Pagamento
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pagamentos</CardTitle>
          <CardDescription>
            {user?.role === 'admin' 
              ? 'Todos os pagamentos do sistema' 
              : user?.role === 'school_admin' 
                ? 'Pagamentos da sua escola' 
                : 'Seus pagamentos'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="paid">Pagos</TabsTrigger>
              <TabsTrigger value="failed">Falhas</TabsTrigger>
              <TabsTrigger value="others">Outros</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Carregando pagamentos...</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>
                            <div className="max-w-[180px] truncate" title={payment.description}>
                              {payment.description}
                            </div>
                            {payment.studentName && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Aluno: {payment.studentName}
                              </div>
                            )}
                            {payment.schoolName && !payment.studentName && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Escola: {payment.schoolName}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount / 100)}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>{getMethodBadge(payment.method)}</TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(payment.createdAt)}</div>
                            {payment.status === 'paid' && payment.paidAt && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Pago em: {formatDate(payment.paidAt)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/payment/${payment.id}`)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              
                              {payment.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleProcessPayment(payment.id)}
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleCancelPayment(payment.id)}
                                  >
                                    ✕
                                  </Button>
                                </>
                              )}
                              
                              {payment.status === 'paid' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRefundPayment(payment.id)}
                                >
                                  Reembolsar
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

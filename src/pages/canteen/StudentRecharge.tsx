
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Receipt, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStudentById } from '@/services/studentService';
import { fetchStudentBalance, addStudentBalance } from '@/services/studentBalanceService';
import { fetchStudentTransactions } from '@/services/studentTransactionService';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function StudentRecharge() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [rechargeAmount, setRechargeAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('pix');
  const queryClient = useQueryClient();

  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => fetchStudentById(studentId!),
    enabled: !!studentId,
  });

  const { data: balance, isLoading: loadingBalance } = useQuery({
    queryKey: ['student-balance', studentId],
    queryFn: () => fetchStudentBalance(studentId!),
    enabled: !!studentId,
  });

  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['student-transactions', studentId],
    queryFn: () => fetchStudentTransactions(studentId!, 20),
    enabled: !!studentId,
  });

  const rechargeBalanceMutation = useMutation({
    mutationFn: (data: { studentId: string, amount: number, method: string }) => 
      addStudentBalance(data.studentId, data.amount, data.method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-balance', studentId] });
      queryClient.invalidateQueries({ queryKey: ['student-transactions', studentId] });
      setRechargeAmount('');
      toast({
        title: "Recarga realizada com sucesso",
        description: `O saldo foi adicionado à conta do estudante.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao realizar recarga",
        description: error.message || "Ocorreu um erro ao processar a recarga",
        variant: "destructive"
      });
    }
  });

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount.replace(',', '.'));
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para recarga",
        variant: "destructive"
      });
      return;
    }
    
    rechargeBalanceMutation.mutate({
      studentId: studentId!,
      amount,
      method: paymentMethod
    });
  };

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: pt });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/canteen/recharges')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Detalhes do Estudante</h1>
          <p className="text-muted-foreground">Gerenciamento de saldo e recargas</p>
        </div>
      </div>
      
      {loadingStudent ? (
        <div className="h-64 w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Carregando informações do estudante...</p>
        </div>
      ) : !student ? (
        <div className="h-64 w-full border rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-muted-foreground mb-4">Estudante não encontrado</p>
            <Button variant="outline" onClick={() => navigate('/canteen/recharges')}>
              Voltar para lista de estudantes
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={student.photo_url} />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{student.name}</h2>
                  <p className="text-muted-foreground">{student.school?.name || 'Sem escola'} • {student.grade || 'Série não informada'}</p>
                  <div className="mt-2 flex items-center">
                    <span className="font-medium mr-2">Saldo atual:</span>
                    {loadingBalance ? (
                      <div className="h-6 w-24 bg-muted/30 animate-pulse rounded"></div>
                    ) : (
                      <span className={`font-bold ${(balance?.balance || 0) <= 10 ? 'text-red-500' : 'text-green-600'}`}>
                        {formatCurrency(balance?.balance)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Nova Recarga</CardTitle>
                <CardDescription>Adicione saldo para o estudante</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium mb-1">Valor da recarga</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">R$</span>
                      <Input
                        id="amount"
                        placeholder="0,00"
                        className="pl-10"
                        value={rechargeAmount}
                        onChange={(e) => {
                          // Allow only numbers and comma
                          const value = e.target.value.replace(/[^\d,]/g, '');
                          setRechargeAmount(value);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="payment-method" className="block text-sm font-medium mb-1">Método de pagamento</label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Selecione o método de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleRecharge}
                  disabled={rechargeBalanceMutation.isPending || !rechargeAmount}
                >
                  {rechargeBalanceMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
                      Processando...
                    </>
                  ) : (
                    <>
                      <Receipt className="h-4 w-4 mr-2" />
                      Realizar Recarga
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>Visualize as transações recentes do estudante</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="recharges">Recargas</TabsTrigger>
                    <TabsTrigger value="purchases">Compras</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <TransactionList 
                      transactions={transactions} 
                      isLoading={loadingTransactions} 
                      filter="all" 
                    />
                  </TabsContent>
                  
                  <TabsContent value="recharges">
                    <TransactionList 
                      transactions={transactions} 
                      isLoading={loadingTransactions} 
                      filter="topup" 
                    />
                  </TabsContent>
                  
                  <TabsContent value="purchases">
                    <TransactionList 
                      transactions={transactions} 
                      isLoading={loadingTransactions} 
                      filter="purchase" 
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

interface TransactionListProps {
  transactions: any[] | undefined;
  isLoading: boolean;
  filter: 'all' | 'topup' | 'purchase';
}

function TransactionList({ transactions, isLoading, filter }: TransactionListProps) {
  const filteredTransactions = transactions?.filter(tx => 
    filter === 'all' || tx.type === filter
  );
  
  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: pt });
  };
  
  if (isLoading) {
    return <div className="h-32 w-full bg-muted/20 animate-pulse rounded-lg"></div>;
  }
  
  if (!filteredTransactions || filteredTransactions.length === 0) {
    return (
      <div className="h-32 w-full border rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma transação encontrada</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Detalhes</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="whitespace-nowrap">{formatDate(tx.transaction_date)}</TableCell>
              <TableCell>
                {tx.type === 'topup' && 'Recarga'}
                {tx.type === 'purchase' && 'Compra'}
                {tx.type === 'refund' && 'Reembolso'}
              </TableCell>
              <TableCell>
                {tx.type === 'purchase' && tx.vendor?.name && `Compra em ${tx.vendor.name}`}
                {tx.type === 'topup' && `Recarga via ${tx.payment_method || 'Sistema'}`}
              </TableCell>
              <TableCell className={`text-right font-medium ${tx.type === 'purchase' ? 'text-red-500' : 'text-green-600'}`}>
                {tx.type === 'purchase' ? '-' : '+'}{formatCurrency(tx.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentGatewayIntegration } from '@/components/payment/PaymentGatewayIntegration';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronRight, 
  CreditCard, 
  Download, 
  FileText, 
  PlusCircle, 
  Settings
} from 'lucide-react';
import { paymentService } from '@/services/paymentService';

export default function Payments() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Mock data for demonstrations
  const recentTransactions = [
    {
      id: 'TX123456',
      date: '2024-05-02',
      amount: 12990,
      method: 'credit_card',
      status: 'paid',
      description: 'Mensalidade Maio 2024 - Plano Premium',
      studentName: 'Lucas Silva'
    },
    {
      id: 'TX123457',
      date: '2024-05-01',
      amount: 5000,
      method: 'pix',
      status: 'paid',
      description: 'Recarga Cantina',
      studentName: 'Maria Oliveira'
    },
    {
      id: 'TX123458',
      date: '2024-04-30',
      amount: 8990,
      method: 'bank_slip',
      status: 'pending',
      description: 'Mensalidade Maio 2024 - Plano Básico',
      studentName: 'João Pedro'
    }
  ];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value / 100);
  };
  
  const handleExportTransactions = () => {
    // Implementation for exporting transactions
    const header = "ID,Data,Valor,Método,Status,Descrição,Aluno\n";
    const csvData = recentTransactions.map(t => 
      `${t.id},"${t.date}","${formatCurrency(t.amount)}","${t.method}","${t.status}","${t.description}","${t.studentName}"`
    ).join('\n');
    
    const blob = new Blob([header + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transacoes.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie pagamentos do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Pagamento
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Transações Recentes</h3>
              
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {transaction.method === 'credit_card' && (
                        <div className="p-2 rounded-full bg-blue-50">
                          <CreditCard className="h-5 w-5 text-blue-500" />
                        </div>
                      )}
                      {transaction.method === 'pix' && (
                        <div className="p-2 rounded-full bg-green-50">
                          <svg width="20" height="20" viewBox="0 0 256 256" className="text-green-500">
                            <path fill="currentColor" d="M205.4 65.4A24.1 24.1 0 0 1 208 76h-34.6a7.9 7.9 0 0 0-5.7 2.3L148.1 98H112a8 8 0 0 0 0 16h31a8 8 0 0 0 5.7-2.3l19.7-19.7H208a24 24 0 1 1-24 24v-3.2a8 8 0 0 0-16 0v3.2a40 40 0 1 0 40-40a40 40 0 0 0-2.6 0Zm-77.1 56.3A8 8 0 0 0 120 120H89a8 8 0 0 0-5.7 2.3l-19.7 19.7H24a24 24 0 1 1 24-24v3.2a8 8 0 0 0 16 0v-3.2a40 40 0 1 0-40 40a39.2 39.2 0 0 0 5.3-.4a40 40 0 0 0 34.8 20.4a39.2 39.2 0 0 0 5.3-.4a40 40 0 0 0 62.2 0a39.2 39.2 0 0 0 5.3.4a40 40 0 0 0 34.8-20.4a39.2 39.2 0 0 0 5.3.4a40.1 40.1 0 0 0 19-5a8 8 0 1 0-7.7-14a23.9 23.9 0 0 1-24.8 3.5a8.2 8.2 0 0 0-10.5 3.9a23.9 23.9 0 0 1-40.9 0a8.2 8.2 0 0 0-10.5-3.9a24 24 0 0 1-32.9-13.5h43.7a7.9 7.9 0 0 0 5.7-2.3Z" />
                          </svg>
                        </div>
                      )}
                      {transaction.method === 'bank_slip' && (
                        <div className="p-2 rounded-full bg-yellow-50">
                          <FileText className="h-5 w-5 text-yellow-500" />
                        </div>
                      )}
                      
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.studentName} · {transaction.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                        <p className="text-sm">
                          {transaction.status === 'paid' && (
                            <span className="text-green-600">Pago</span>
                          )}
                          {transaction.status === 'pending' && (
                            <span className="text-amber-600">Pendente</span>
                          )}
                        </p>
                      </div>
                      
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">Ver todas as transações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium">Relatórios Financeiros</h3>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Relatório de Transações</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Relatório de Vendas da Cantina</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Relatório de Recargas</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Relatório de Mensalidades</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <PaymentGatewayIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
}

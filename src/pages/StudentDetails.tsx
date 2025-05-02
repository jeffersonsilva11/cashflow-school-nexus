
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Clock, 
  CreditCard, 
  ArrowLeft, 
  Edit, 
  Wallet,
  ShoppingCart,
  School,
  UserRound
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StudentDetails() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  
  // Dados mockados para o aluno específico
  const studentData = {
    id: studentId || 'STD00498',
    name: 'Maria Silva',
    grade: '9º Ano B',
    school: {
      id: 'SCH001',
      name: 'Colégio São Paulo'
    },
    parent: {
      id: 'PAR001',
      name: 'José Silva',
      email: 'jose.silva@exemplo.com',
      phone: '(11) 98765-4321'
    },
    photo: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
    registrationDate: '2025-01-15T10:30:00',
    dateOfBirth: '2010-05-20',
    deviceId: 'CARD-2023-8742',
    balance: 124.50,
    restrictions: ['Chocolates', 'Refrigerantes'],
    accessLog: [
      { id: 'LOG001', date: '2025-05-01T07:45:00', type: 'entry', location: 'Portaria Principal' },
      { id: 'LOG002', date: '2025-05-01T17:15:00', type: 'exit', location: 'Portaria Principal' },
      { id: 'LOG003', date: '2025-04-30T07:50:00', type: 'entry', location: 'Portaria Principal' },
      { id: 'LOG004', date: '2025-04-30T17:10:00', type: 'exit', location: 'Portaria Principal' },
      { id: 'LOG005', date: '2025-04-29T07:45:00', type: 'entry', location: 'Portaria Principal' },
    ],
    transactions: [
      { id: 'TRX001', date: '2025-05-01T10:30:00', type: 'purchase', description: 'Lanche - Cantina', amount: -12.50 },
      { id: 'TRX002', date: '2025-04-30T09:45:00', type: 'purchase', description: 'Suco - Cantina', amount: -5.00 },
      { id: 'TRX003', date: '2025-04-30T15:20:00', type: 'purchase', description: 'Snack - Cantina', amount: -7.50 },
      { id: 'TRX004', date: '2025-04-28T16:00:00', type: 'reload', description: 'Recarga via app', amount: 150.00 },
      { id: 'TRX005', date: '2025-04-25T11:15:00', type: 'purchase', description: 'Almoço - Cantina', amount: -15.50 },
    ]
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/students')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold tracking-tight">{studentData.name}</h1>
            </div>
            <p className="text-muted-foreground">
              Detalhes do aluno {studentData.id} - {studentData.grade} - {studentData.school.name}
            </p>
          </div>
        </div>
        <Button className="gap-1" onClick={() => navigate(`/students/${studentId}/edit`)}>
          <Edit className="h-4 w-4" />
          Editar Aluno
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados cadastrais do aluno</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4 mb-4">
              <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                <img 
                  src={studentData.photo} 
                  alt={studentData.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <h3 className="font-bold text-lg mb-1">{studentData.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{studentData.grade}</p>
              <Badge
                variant={studentData.status === 'active' ? 'default' : 
                         studentData.status === 'pending' ? 'outline' : 'secondary'}
                className="mt-1"
              >
                {studentData.status === 'active' ? 'Ativo' : 
                 studentData.status === 'pending' ? 'Pendente' : 'Inativo'}
              </Badge>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Matrícula</span>
                <span className="text-sm font-medium">{studentData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Data de Nascimento</span>
                <span className="text-sm font-medium">
                  {new Date(studentData.dateOfBirth).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cadastro</span>
                <span className="text-sm font-medium">
                  {new Date(studentData.registrationDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-2">Responsável</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 mb-2"
                  onClick={() => navigate(`/parents/${studentData.parent.id}`)}
                >
                  <UserRound className="h-4 w-4" />
                  {studentData.parent.name}
                </Button>
                <p className="text-xs text-muted-foreground">{studentData.parent.email}</p>
                <p className="text-xs text-muted-foreground">{studentData.parent.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <Tabs defaultValue="transactions">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Atividades e Histórico</CardTitle>
                <TabsList>
                  <TabsTrigger value="transactions" className="flex items-center gap-1">
                    <Wallet size={14} />
                    <span>Financeiro</span>
                  </TabsTrigger>
                  <TabsTrigger value="access" className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Acessos</span>
                  </TabsTrigger>
                  <TabsTrigger value="device" className="flex items-center gap-1">
                    <CreditCard size={14} />
                    <span>Dispositivo</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription className="mt-2">Históricos e registros do aluno</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="transactions">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Saldo e Transações</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-medium">Saldo Atual:</span>
                      <span className="text-lg font-bold text-green-600">R$ {studentData.balance.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Restrições de Compra</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {studentData.restrictions.map((item, index) => (
                          <Badge variant="outline" key={index}>
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Últimas Transações</h4>
                      <Button variant="outline" size="sm">Ver Todas</Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data/Hora</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentData.transactions.map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell>{new Date(transaction.date).toLocaleString('pt-BR')}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={transaction.type === 'reload' ? 'default' : 'outline'}
                                className="capitalize"
                              >
                                {transaction.type === 'reload' ? 'Recarga' : 'Compra'}
                              </Badge>
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className={`text-right font-medium ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}
                              R$ {Math.abs(transaction.amount).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="access">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Histórico de Acessos</h3>
                    <Button variant="outline" size="sm">Ver Todos</Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Local</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentData.accessLog.map(log => (
                        <TableRow key={log.id}>
                          <TableCell>{new Date(log.date).toLocaleString('pt-BR')}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={log.type === 'entry' ? 'default' : 'secondary'}
                            >
                              {log.type === 'entry' ? 'Entrada' : 'Saída'}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="device">
                <div className="space-y-6">
                  {studentData.deviceId ? (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Dispositivo Vinculado</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/devices/${studentData.deviceId}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-6 flex flex-col sm:flex-row gap-6 items-center">
                        <div className="bg-slate-100 p-8 rounded-lg">
                          <CreditCard className="h-16 w-16 text-primary" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="font-medium text-lg">Cartão {studentData.deviceId}</h4>
                            <p className="text-muted-foreground">Vinculado ao aluno {studentData.name}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm text-muted-foreground">Funções habilitadas</h5>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline">Pagamentos</Badge>
                                <Badge variant="outline">Controle de Acesso</Badge>
                                <Badge variant="outline">Identificação</Badge>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-sm text-muted-foreground">Status</h5>
                              <Badge className="mt-1">Ativo</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-muted rounded-full p-4 mb-4">
                        <CreditCard className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Nenhum dispositivo vinculado</h3>
                      <p className="text-muted-foreground max-w-md mb-6">
                        Este aluno ainda não possui um cartão ou pulseira vinculado ao seu cadastro.
                      </p>
                      <Button>Vincular Dispositivo</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <School className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Informações Escolares</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h4 className="font-medium">Escola</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/schools/${studentData.school.id}`)}
                >
                  Ver Escola
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm text-muted-foreground mb-1">Nome</h5>
                  <p>{studentData.school.name}</p>
                </div>
                <div>
                  <h5 className="text-sm text-muted-foreground mb-1">Turma</h5>
                  <p>{studentData.grade}</p>
                </div>
                <div>
                  <h5 className="text-sm text-muted-foreground mb-1">Matrícula</h5>
                  <p>{studentData.id}</p>
                </div>
                <div>
                  <h5 className="text-sm text-muted-foreground mb-1">Status</h5>
                  <Badge
                    variant={studentData.status === 'active' ? 'default' : 
                             studentData.status === 'pending' ? 'outline' : 'secondary'}
                  >
                    {studentData.status === 'active' ? 'Ativo' : 
                     studentData.status === 'pending' ? 'Pendente' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Resumo de Consumo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <h5 className="text-sm text-muted-foreground mb-1">Gasto Mensal</h5>
                  <p className="text-2xl font-bold">R$ 156,00</p>
                  <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h5 className="text-sm text-muted-foreground mb-1">Recargas</h5>
                  <p className="text-2xl font-bold">R$ 250,00</p>
                  <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Itens mais comprados</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Almoço</span>
                    <span className="font-medium">R$ 82,50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Lanches</span>
                    <span className="font-medium">R$ 45,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bebidas</span>
                    <span className="font-medium">R$ 28,50</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

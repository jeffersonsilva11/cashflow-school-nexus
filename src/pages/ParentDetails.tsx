
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRound, Clock, UsersRound, Settings, Edit, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ParentDetails() {
  const { parentId } = useParams<{ parentId: string }>();
  const navigate = useNavigate();
  
  // Dados mockados para o responsável específico
  const parentData = {
    id: parentId || 'PAR001',
    name: 'José Silva',
    email: 'jose.silva@exemplo.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    address: 'Rua Exemplo, 123 - Bairro - São Paulo/SP',
    status: 'active',
    registrationDate: '2025-01-15T10:30:00',
    lastAccess: '2025-04-30T14:35:00',
    paymentMethod: 'Cartão de Crédito',
    notes: 'Pai de Maria e João. Prefere receber comunicados por WhatsApp.',
    students: [
      {
        id: 'STD00498',
        name: 'Maria Silva',
        grade: '9º Ano B',
        school: 'Colégio São Paulo',
        photo: 'https://i.pravatar.cc/150?img=5',
        deviceId: 'CARD-2023-8742'
      },
      {
        id: 'STD00499',
        name: 'João Silva',
        grade: '5º Ano A',
        school: 'Colégio São Paulo',
        photo: 'https://i.pravatar.cc/150?img=3',
        deviceId: 'CARD-2023-9856'
      }
    ],
    accessLog: [
      { id: 'LOG001', date: '2025-04-30T14:35:00', action: 'login', description: 'Login no aplicativo' },
      { id: 'LOG002', date: '2025-04-30T14:40:00', action: 'recharge', description: 'Recarga de R$ 100,00 para Maria' },
      { id: 'LOG003', date: '2025-04-29T08:15:00', action: 'login', description: 'Login no aplicativo' },
      { id: 'LOG004', date: '2025-04-29T08:20:00', action: 'report', description: 'Visualizou relatório de gastos' },
      { id: 'LOG005', date: '2025-04-27T19:40:00', action: 'login', description: 'Login no aplicativo' },
    ]
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/parents')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <UserRound className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold tracking-tight">{parentData.name}</h1>
            </div>
            <p className="text-muted-foreground">Detalhes do responsável e dependentes vinculados</p>
          </div>
        </div>
        <Button className="gap-1" onClick={() => navigate(`/parents/${parentId}/edit`)}>
          <Edit className="h-4 w-4" />
          Editar Responsável
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados cadastrais do responsável</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4 mb-4">
              <div className="bg-muted h-20 w-20 rounded-full flex items-center justify-center mb-4">
                <UserRound className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-1">{parentData.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{parentData.email}</p>
              <Badge
                variant={parentData.status === 'active' ? 'default' : 
                         parentData.status === 'pending' ? 'outline' : 'secondary'}
                className="mt-1"
              >
                {parentData.status === 'active' ? 'Ativo' : 
                 parentData.status === 'pending' ? 'Pendente' : 'Inativo'}
              </Badge>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ID</span>
                <span className="text-sm font-medium">{parentData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Telefone</span>
                <span className="text-sm font-medium">{parentData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">CPF</span>
                <span className="text-sm font-medium">{parentData.cpf}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Data de Cadastro</span>
                <span className="text-sm font-medium">
                  {new Date(parentData.registrationDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Último Acesso</span>
                <span className="text-sm font-medium">
                  {new Date(parentData.lastAccess).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex flex-col pt-2">
                <span className="text-sm text-muted-foreground mb-1">Endereço</span>
                <span className="text-sm font-medium">{parentData.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <Tabs defaultValue="students">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Gerenciamento</CardTitle>
                <TabsList>
                  <TabsTrigger value="students" className="flex items-center gap-1">
                    <UsersRound size={14} />
                    <span>Dependentes</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Atividade</span>
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex items-center gap-1">
                    <Settings size={14} />
                    <span>Preferências</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription className="mt-2">Dados adicionais e configurações</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="students">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Alunos Dependentes</h3>
                    <Button size="sm">Adicionar Dependente</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {parentData.students.map(student => (
                      <Card key={student.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-1/4 flex justify-center items-center p-4 bg-muted">
                            <div className="h-20 w-20 rounded-full overflow-hidden">
                              <img 
                                src={student.photo} 
                                alt={student.name} 
                                className="h-full w-full object-cover" 
                              />
                            </div>
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-col sm:flex-row justify-between mb-2">
                              <h4 className="font-bold text-lg">{student.name}</h4>
                              <span className="text-sm text-muted-foreground">{student.id}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                              <div>
                                <span className="text-sm text-muted-foreground block">Turma</span>
                                <span>{student.grade}</span>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground block">Escola</span>
                                <span>{student.school}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm text-muted-foreground block">Dispositivo</span>
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto"
                                  onClick={() => navigate(`/devices/${student.deviceId}`)}
                                >
                                  {student.deviceId}
                                </Button>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/students/${student.id}`)}
                              >
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Histórico de Atividades</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parentData.accessLog.map(log => (
                        <TableRow key={log.id}>
                          <TableCell>{new Date(log.date).toLocaleString('pt-BR')}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="preferences">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferências e Configurações</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Método de Pagamento</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{parentData.paymentMethod}</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Observações</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{parentData.notes}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Notificações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          As preferências de notificações podem ser configuradas no aplicativo do responsável.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

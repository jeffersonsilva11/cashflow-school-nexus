
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { 
  CreditCard, 
  User, 
  School, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Lock, 
  RefreshCw 
} from 'lucide-react';

export default function DeviceDetails() {
  const { deviceId } = useParams<{ deviceId: string }>();
  
  // Dados mockados para o dispositivo específico
  const deviceData = {
    id: deviceId || 'CARD-2023-8742',
    serial: 'CARD-2023-8742',
    uid: '04:A2:E9:12:5F',
    type: 'Cartão',
    status: 'active',
    batch: 'LOT-2023-05A',
    batchName: 'Lote Maio 2023 - Cartões',
    activationDate: '2023-05-20',
    school: {
      id: 'SCH001',
      name: 'Colégio São Paulo'
    },
    student: {
      id: 'STD00498',
      name: 'Maria Silva',
      grade: '9º Ano B',
      photo: 'https://i.pravatar.cc/150?img=5'
    },
    settings: {
      enabledFeatures: ['payments', 'access', 'identification'],
      dailyLimit: 50.0,
      restrictedProducts: ['Refrigerantes', 'Doces']
    },
    events: [
      { id: 'EV001', type: 'activation', date: '2023-05-20T14:32:00', description: 'Dispositivo ativado' },
      { id: 'EV002', type: 'allocation', date: '2023-05-20T14:35:00', description: 'Alocado para Colégio São Paulo' },
      { id: 'EV003', type: 'binding', date: '2023-05-22T10:15:00', description: 'Vinculado ao estudante Maria Silva' },
      { id: 'EV004', type: 'transaction', date: '2023-05-22T12:30:00', description: 'Primeira transação realizada: R$ 8,50' },
      { id: 'EV005', type: 'access', date: '2023-05-22T07:45:00', description: 'Acesso registrado: Entrada na escola' },
    ]
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold tracking-tight">Detalhes do Dispositivo</h1>
          </div>
          <p className="text-muted-foreground">Gerenciamento completo do dispositivo {deviceData.serial}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1" asChild>
            <Link to={`/devices/${deviceId}/edit`}>
              <Edit size={16} />
              Editar
            </Link>
          </Button>
          <Button variant="outline" className="gap-1">
            <Lock size={16} />
            Bloquear
          </Button>
          <Button variant="outline" className="gap-1" asChild>
            <Link to={`/devices/${deviceId}/replace`}>
              <RefreshCw size={16} />
              Substituir
            </Link>
          </Button>
          <Button variant="destructive" className="gap-1">
            <XCircle size={16} />
            Desativar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Dispositivo</CardTitle>
            <CardDescription>Detalhes técnicos e identificação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <StatusBadge status={deviceData.status} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Número de Série</span>
                  <span className="text-sm font-medium">{deviceData.serial}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">UID NFC</span>
                  <span className="text-sm font-medium">{deviceData.uid}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo</span>
                  <span className="text-sm font-medium">{deviceData.type}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lote</span>
                  <span className="text-sm font-medium">{deviceData.batch}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data de Ativação</span>
                  <span className="text-sm font-medium">{new Date(deviceData.activationDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Recursos Habilitados</h4>
                <div className="flex flex-wrap gap-2">
                  {deviceData.settings.enabledFeatures.includes('payments') && (
                    <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle size={12} className="mr-1" /> Pagamentos
                    </div>
                  )}
                  {deviceData.settings.enabledFeatures.includes('access') && (
                    <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle size={12} className="mr-1" /> Controle de Acesso
                    </div>
                  )}
                  {deviceData.settings.enabledFeatures.includes('identification') && (
                    <div className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle size={12} className="mr-1" /> Identificação
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Escola</CardTitle>
            <CardDescription>Instituição onde o dispositivo está alocado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <School className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-1">{deviceData.school.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">ID: {deviceData.school.id}</p>
              
              <Button variant="outline" className="w-full">Ver Detalhes da Escola</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Estudante</CardTitle>
            <CardDescription>Usuário vinculado ao dispositivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4">
              {deviceData.student ? (
                <>
                  <div className="h-16 w-16 rounded-full overflow-hidden mb-4">
                    <img src={deviceData.student.photo} alt={deviceData.student.name} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{deviceData.student.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{deviceData.student.grade}</p>
                  <p className="text-sm text-muted-foreground mb-4">ID: {deviceData.student.id}</p>
                  
                  <Button variant="outline" className="w-full">Ver Perfil do Estudante</Button>
                </>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground mb-4">Nenhum estudante vinculado</p>
                  <Button className="w-full">Vincular Estudante</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events" className="flex items-center gap-1">
              <Clock size={14} />
              <span>Histórico de Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-1">
              <CreditCard size={14} />
              <span>Transações</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertCircle size={14} />
              <span>Alertas</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Eventos</CardTitle>
                <CardDescription>Registro completo de atividades do dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l border-gray-200 space-y-6">
                  {deviceData.events.map((event, index) => (
                    <div key={event.id} className="relative mb-6">
                      <div className="absolute top-0 left-[-1.34rem] h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        {event.type === 'activation' && <CheckCircle size={14} className="text-white" />}
                        {event.type === 'allocation' && <School size={14} className="text-white" />}
                        {event.type === 'binding' && <User size={14} className="text-white" />}
                        {event.type === 'transaction' && <CreditCard size={14} className="text-white" />}
                        {event.type === 'access' && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{event.description}</h4>
                        <time className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('pt-BR', { 
                            day: 'numeric', 
                            month: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transações</CardTitle>
                <CardDescription>Histórico de pagamentos realizados com este dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
                  <CreditCard className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Módulo de Transações</h3>
                  <p className="text-muted-foreground max-w-md">
                    O histórico detalhado de transações será integrado em breve.
                    Você poderá visualizar todos os pagamentos realizados com este dispositivo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas</CardTitle>
                <CardDescription>Ocorrências e notificações relacionadas a este dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum Alerta</h3>
                  <p className="text-muted-foreground max-w-md">
                    Este dispositivo não possui alertas ou ocorrências registradas até o momento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

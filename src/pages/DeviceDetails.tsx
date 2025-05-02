
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, AlertCircle, Clock } from 'lucide-react';
import { DeviceInfoCard } from '@/components/devices/DeviceInfoCard';
import { SchoolCard } from '@/components/devices/SchoolCard';
import { StudentCard } from '@/components/devices/StudentCard';
import { DeviceEventTimeline } from '@/components/devices/DeviceEventTimeline';
import { DeviceTransactions } from '@/components/devices/DeviceTransactions';
import { DeviceAlerts } from '@/components/devices/DeviceAlerts';
import { DeviceActionButtons } from '@/components/devices/DeviceActionButtons';

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
        <DeviceActionButtons deviceId={deviceData.id} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DeviceInfoCard deviceData={deviceData} />
        <SchoolCard school={deviceData.school} />
        <StudentCard student={deviceData.student} />
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
            <DeviceEventTimeline events={deviceData.events} />
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <DeviceTransactions />
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <DeviceAlerts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

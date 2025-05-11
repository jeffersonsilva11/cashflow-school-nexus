
import React from 'react';
import { NotificationPreferencesPanel } from '@/components/notifications/NotificationPreferencesPanel';
import { createMockNotification } from '@/services/notificationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const NotificationSettings = () => {
  const { user } = useAuth();
  
  const handleCreateTestNotification = async (type: 'device_alert' | 'transaction' | 'system' | 'school') => {
    if (!user?.id) return;
    
    const notificationData = {
      recipientId: user.id,
      title: `Notificação de teste (${type})`,
      message: getNotificationMessage(type),
      type,
    };
    
    try {
      await createMockNotification(notificationData);
      toast({
        title: 'Notificação criada',
        description: 'Uma notificação de teste foi criada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao criar notificação de teste:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a notificação de teste',
        variant: 'destructive',
      });
    }
  };
  
  const getNotificationMessage = (type: string) => {
    switch (type) {
      case 'device_alert':
        return 'O dispositivo DEV-001234 está com bateria baixa (15%). Recomendamos recarregá-lo em breve.';
      case 'transaction':
        return 'Transação #TX-56789 no valor de R$ 25,00 foi concluída com sucesso.';
      case 'system':
        return 'O sistema será atualizado para a versão 2.5.0 hoje à noite às 23:00. Pode haver instabilidade durante a atualização.';
      case 'school':
        return 'A escola "Colégio Exemplo" atualizou seu plano para Premium.';
      default:
        return 'Esta é uma notificação de teste do sistema.';
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Configurações de Notificações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências de notificações e alertas
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NotificationPreferencesPanel />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Testes de Notificação</CardTitle>
              <CardDescription>
                Use estas opções para enviar notificações de teste para si mesmo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleCreateTestNotification('device_alert')}
              >
                Criar alerta de dispositivo
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleCreateTestNotification('transaction')}
              >
                Criar alerta de transação
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleCreateTestNotification('system')}
              >
                Criar alerta de sistema
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleCreateTestNotification('school')}
              >
                Criar alerta de escola
              </Button>
              
              <div className="text-xs text-muted-foreground mt-4 border-t pt-4">
                <p>
                  Estas opções apenas enviam notificações para o seu próprio usuário e são úteis para testar a funcionalidade de notificações.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;

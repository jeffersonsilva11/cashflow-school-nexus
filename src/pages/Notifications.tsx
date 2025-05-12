
import React, { useState } from 'react';
import { Bell, BarChart3, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications, useMarkAllNotificationsAsRead } from '@/services/notificationService';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationPreferencesPanel } from '@/components/notifications/NotificationPreferencesPanel';
import { Notification, NotificationType } from '@/types/notification';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { data: notifications = [], isLoading, refetch } = useNotifications();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  
  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        refetch();
      }
    });
  };
  
  const getFilteredNotifications = (type?: string) => {
    if (!type || type === 'all') return notifications;
    return notifications.filter(notification => notification.type === type as NotificationType);
  };
  
  const getUnreadCount = (type?: string) => {
    const filtered = getFilteredNotifications(type);
    return filtered.filter(notification => !notification.isRead).length;
  };
  
  const hasUnreadNotifications = notifications.some(notification => !notification.isRead);
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'preferences' 
    ? [] 
    : getFilteredNotifications(activeTab);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas notificações e preferências
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all" className="relative">
              Todas
              {getUnreadCount('all') > 0 && (
                <Badge className="ml-2 h-5 px-1 bg-red-500">{getUnreadCount('all')}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="device_alert" className="relative">
              Dispositivos
              {getUnreadCount('device_alert') > 0 && (
                <Badge className="ml-2 h-5 px-1 bg-red-500">{getUnreadCount('device_alert')}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transaction" className="relative">
              Transações
              {getUnreadCount('transaction') > 0 && (
                <Badge className="ml-2 h-5 px-1 bg-red-500">{getUnreadCount('transaction')}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="system" className="relative">
              Sistema
              {getUnreadCount('system') > 0 && (
                <Badge className="ml-2 h-5 px-1 bg-red-500">{getUnreadCount('system')}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="school" className="relative">
              Escolas
              {getUnreadCount('school') > 0 && (
                <Badge className="ml-2 h-5 px-1 bg-red-500">{getUnreadCount('school')}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          {activeTab !== 'preferences' && hasUnreadNotifications && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-4 w-4" /> Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <TabsContent value={activeTab} className="m-0">
          {activeTab === 'preferences' ? (
            <NotificationPreferencesPanel />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {activeTab === 'all' 
                    ? 'Todas as Notificações' 
                    : activeTab === 'device_alert' 
                      ? 'Alertas de Dispositivos'
                      : activeTab === 'transaction'
                        ? 'Notificações de Transações'
                        : activeTab === 'system'
                          ? 'Alertas de Sistema'
                          : 'Notificações de Escolas'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  <div className="space-y-0 divide-y border rounded-md">
                    {filteredNotifications.map((notification: Notification) => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification}
                        onActionComplete={() => refetch()}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                    <h3 className="mt-4 text-lg font-medium">Nenhuma notificação</h3>
                    <p className="text-muted-foreground mt-1">
                      Você não tem nenhuma notificação nesta categoria.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {activeTab !== 'preferences' && (
        <div className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Visão Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="bg-muted rounded-md p-4">
                  <div className="text-muted-foreground text-sm">Total de Notificações</div>
                  <div className="text-2xl font-bold mt-1">{notifications.length}</div>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <div className="text-muted-foreground text-sm">Não Lidas</div>
                  <div className="text-2xl font-bold mt-1">{getUnreadCount('all')}</div>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <div className="text-muted-foreground text-sm">Alertas de Dispositivo</div>
                  <div className="text-2xl font-bold mt-1">{getFilteredNotifications('device_alert').length}</div>
                </div>
                <div className="bg-muted rounded-md p-4">
                  <div className="text-muted-foreground text-sm">Alertas de Transação</div>
                  <div className="text-2xl font-bold mt-1">{getFilteredNotifications('transaction').length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Notifications;

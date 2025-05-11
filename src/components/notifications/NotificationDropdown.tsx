
import { useState, useEffect } from 'react';
import { Bell, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationItem } from './NotificationItem';
import { useNotifications, useUnreadNotificationCount, useMarkAllNotificationsAsRead } from '@/services/notificationService';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: notifications = [], isLoading: loadingNotifications, refetch } = useNotifications();
  const { data: unreadCount = 0, refetch: refetchCount } = useUnreadNotificationCount();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  
  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        refetch();
        refetchCount();
      }
    });
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);
  
  const handleActionComplete = () => {
    refetch();
    refetchCount();
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (open) {
      refetch();
      refetchCount();
    }
  }, [open, refetch, refetchCount]);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="h-5 w-5 absolute -top-1 -right-1 flex items-center justify-center text-[10px] bg-red-500">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-3.5 w-3.5 mr-1" /> Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-3 pt-2 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1 text-xs">
                Todas
              </TabsTrigger>
              <TabsTrigger value="device_alert" className="flex-1 text-xs">
                Dispositivos
              </TabsTrigger>
              <TabsTrigger value="transaction" className="flex-1 text-xs">
                Transações
              </TabsTrigger>
              <TabsTrigger value="system" className="flex-1 text-xs">
                Sistema
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="m-0">
            <div className="max-h-[350px] overflow-y-auto">
              {loadingNotifications ? (
                <div className="flex justify-center items-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onActionComplete={handleActionComplete}
                  />
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>Nenhuma notificação encontrada</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DropdownMenuSeparator />
        <Link to="/notifications" onClick={() => setOpen(false)}>
          <DropdownMenuItem className="cursor-pointer justify-center font-medium text-primary">
            Ver todas as notificações
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

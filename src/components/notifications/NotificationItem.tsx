
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, AlertTriangle, CreditCard, Info, Building2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notification';
import { useMarkNotificationAsRead, useDeleteNotification } from '@/services/notificationService';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onActionComplete?: () => void;
}

export const NotificationItem = ({ notification, onActionComplete }: NotificationItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      markAsRead(notification.id, {
        onSuccess: () => {
          if (onActionComplete) onActionComplete();
        }
      });
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id, {
      onSuccess: () => {
        if (onActionComplete) onActionComplete();
      }
    });
  };
  
  const renderIcon = () => {
    switch (notification.type) {
      case 'device_alert':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'transaction':
        return <CreditCard className="h-5 w-5 text-emerald-600" />;
      case 'school':
        return <Building2 className="h-5 w-5 text-blue-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };
  
  return (
    <div 
      className={cn(
        "p-4 border-b last:border-b-0 cursor-pointer transition-colors",
        notification.isRead ? "bg-white" : "bg-blue-50",
        isExpanded ? "bg-gray-50" : ""
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{renderIcon()}</div>
        <div className="flex-1">
          <div className="font-medium text-sm">{notification.title}</div>
          <div className={cn(
            "text-sm mt-1 transition-all",
            isExpanded ? "line-clamp-none" : "line-clamp-2"
          )}>
            {notification.message}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatDate(notification.createdAt)}
          </div>
          
          {isExpanded && (
            <div className="flex gap-2 mt-3">
              {!notification.isRead && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-xs"
                  onClick={handleMarkAsRead}
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Marcar como lida
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs text-red-600 hover:text-red-700"
                onClick={handleDelete}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Excluir
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationFilters, NotificationPreferences } from "@/types/notification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Fetch notifications for the current user
export const useNotifications = (filters?: NotificationFilters) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notifications', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters?.onlyUnread) {
        query = query.eq('is_read', false);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: "Erro ao buscar notificações",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data.map(notification => ({
        id: notification.id,
        recipientId: notification.recipient_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        relatedResourceType: notification.related_resource_type,
        relatedResourceId: notification.related_resource_id,
        isRead: notification.is_read,
        createdAt: notification.created_at,
        expiresAt: notification.expires_at,
      })) as Notification[];
    },
    enabled: !!user?.id,
  });
};

// Get unread notification count
export const useUnreadNotificationCount = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notifications-unread-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error fetching unread notifications count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!user?.id,
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('recipient_id', user?.id);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Erro ao marcar notificação como lida",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user?.id)
        .eq('is_read', false);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas",
      });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Erro ao marcar todas notificações como lidas",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      toast({
        title: "Sucesso",
        description: "Notificação excluída com sucesso",
      });
    },
    onError: (error) => {
      console.error('Error deleting notification:', error);
      toast({
        title: "Erro ao excluir notificação",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Fetch notification preferences
export const useNotificationPreferences = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching notification preferences:', error);
        toast({
          title: "Erro ao buscar preferências de notificações",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
      
      // If preferences don't exist, create default ones
      if (!data) {
        const defaultPreferences = {
          user_id: user.id,
          device_alerts: true,
          transaction_alerts: true,
          system_alerts: true,
          school_alerts: true,
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('notification_preferences')
          .insert(defaultPreferences)
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating notification preferences:', insertError);
          return null;
        }
        
        return {
          id: newData.id,
          userId: newData.user_id,
          deviceAlerts: newData.device_alerts,
          transactionAlerts: newData.transaction_alerts,
          systemAlerts: newData.system_alerts,
          schoolAlerts: newData.school_alerts,
          createdAt: newData.created_at,
          updatedAt: newData.updated_at,
        } as NotificationPreferences;
      }
      
      return {
        id: data.id,
        userId: data.user_id,
        deviceAlerts: data.device_alerts,
        transactionAlerts: data.transaction_alerts,
        systemAlerts: data.system_alerts,
        schoolAlerts: data.school_alerts,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as NotificationPreferences;
    },
    enabled: !!user?.id,
  });
};

// Update notification preferences
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (preferences: Partial<NotificationPreferences>) => {
      const { error } = await supabase
        .from('notification_preferences')
        .update({
          device_alerts: preferences.deviceAlerts,
          transaction_alerts: preferences.transactionAlerts,
          system_alerts: preferences.systemAlerts,
          school_alerts: preferences.schoolAlerts,
        })
        .eq('id', preferences.id);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificações foram atualizadas com sucesso",
      });
    },
    onError: (error) => {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Erro ao atualizar preferências",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Mock function to simulate creating a notification (for testing purposes)
export const createMockNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: notification.recipientId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        related_resource_type: notification.relatedResourceType,
        related_resource_id: notification.relatedResourceId,
        expires_at: notification.expiresAt,
      });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error creating mock notification:', error);
    return { success: false, error };
  }
};


import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { parseParticipants } from "./utils";

/**
 * Hook to fetch messages for a specific thread
 */
export const useThreadMessages = (threadId?: string) => {
  return useQuery({
    queryKey: ['thread-messages', threadId],
    queryFn: async () => {
      if (!threadId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Erro ao buscar mensagens",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      // Get thread to access participants
      const { data: threadData, error: threadError } = await supabase
        .from('message_threads')
        .select('*')
        .eq('id', threadId)
        .single();
      
      if (threadError) {
        console.error('Error fetching thread:', threadError);
        return data.map(message => ({
          id: message.id,
          threadId: message.thread_id,
          senderId: message.sender_id,
          content: message.content,
          isRead: message.is_read,
          createdAt: message.created_at,
          attachments: message.attachments,
        })) as Message[];
      }
      
      // Parse JSON participants safely
      const participantsArray = parseParticipants(threadData.participants);
      
      // Map messages with sender information
      return data.map(message => {
        // Find sender safely with proper typing
        const sender = participantsArray.find(p => 
          p.userId === message.sender_id
        );
        
        return {
          id: message.id,
          threadId: message.thread_id,
          senderId: message.sender_id,
          content: message.content,
          isRead: message.is_read,
          createdAt: message.created_at,
          attachments: message.attachments,
          senderName: sender ? (sender.name || 'Usuário') : 'Usuário',
          senderAvatar: sender ? (sender.avatar || undefined) : undefined,
        };
      }) as Message[];
    },
    enabled: !!threadId,
  });
};

/**
 * Hook to send a message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ threadId, content, attachments }: { threadId: string; content: string; attachments?: any[] }) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content,
          attachments: attachments ? attachments : null,
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['thread-messages', variables.threadId] });
      queryClient.invalidateQueries({ queryKey: ['message-threads'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to mark thread messages as read
 */
export const useMarkThreadMessagesAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (threadId: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('thread_id', threadId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, threadId) => {
      queryClient.invalidateQueries({ queryKey: ['thread-messages', threadId] });
      queryClient.invalidateQueries({ queryKey: ['message-threads'] });
    },
    onError: (error) => {
      console.error('Error marking messages as read:', error);
    },
  });
};

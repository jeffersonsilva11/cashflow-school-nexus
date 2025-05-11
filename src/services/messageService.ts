
import { supabase } from "@/integrations/supabase/client";
import { Message, MessageThread, MessageParticipant } from "@/types/message";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Fetch message threads for the current user
export const useMessageThreads = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['message-threads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('message_threads')
        .select('*')
        .order('last_message_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching message threads:', error);
        toast({
          title: "Erro ao buscar conversas",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      // For each thread, get unread message count
      const threadsWithUnreadCount = await Promise.all(
        data.map(async (thread) => {
          const { count, error: countError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);
          
          // Get the last message
          const { data: lastMessages, error: lastMessageError } = await supabase
            .from('messages')
            .select('*')
            .eq('thread_id', thread.id)
            .order('created_at', { ascending: false })
            .limit(1);
          
          let lastMessage = undefined;
          
          if (!lastMessageError && lastMessages.length > 0) {
            // Find sender info in participants
            const sender = thread.participants.find(p => p.user_id === lastMessages[0].sender_id);
            
            lastMessage = {
              content: lastMessages[0].content,
              senderId: lastMessages[0].sender_id,
              senderName: sender ? sender.name : 'Usuário',
            };
          }
          
          return {
            id: thread.id,
            title: thread.title,
            createdBy: thread.created_by,
            createdAt: thread.created_at,
            updatedAt: thread.updated_at,
            lastMessageAt: thread.last_message_at,
            participants: thread.participants,
            threadType: thread.thread_type,
            unreadCount: countError ? 0 : count || 0,
            lastMessage,
          };
        })
      );
      
      return threadsWithUnreadCount as MessageThread[];
    },
    enabled: !!user?.id,
  });
};

// Fetch messages for a specific thread
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
      
      // Map messages with sender information
      return data.map(message => {
        const sender = threadData.participants.find(p => p.user_id === message.sender_id);
        
        return {
          id: message.id,
          threadId: message.thread_id,
          senderId: message.sender_id,
          content: message.content,
          isRead: message.is_read,
          createdAt: message.created_at,
          attachments: message.attachments,
          senderName: sender?.name || 'Usuário',
          senderAvatar: sender?.avatar,
        };
      }) as Message[];
    },
    enabled: !!threadId,
  });
};

// Send a message
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

// Create a new message thread
export const useCreateMessageThread = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      title, 
      participants, 
      threadType = 'direct',
      initialMessage
    }: { 
      title: string; 
      participants: MessageParticipant[]; 
      threadType?: 'direct' | 'group' | 'support';
      initialMessage?: string;
    }) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      // Make sure current user is in participants
      const currentUserInParticipants = participants.some(p => p.userId === user.id);
      
      if (!currentUserInParticipants) {
        participants.push({
          userId: user.id,
          name: user.name || 'Eu',
          role: user.role || 'user',
        });
      }
      
      // Create thread
      const { data: threadData, error: threadError } = await supabase
        .from('message_threads')
        .insert({
          title,
          created_by: user.id,
          participants,
          thread_type: threadType,
        })
        .select()
        .single();
      
      if (threadError) {
        throw new Error(threadError.message);
      }
      
      // Send initial message if provided
      if (initialMessage) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            thread_id: threadData.id,
            sender_id: user.id,
            content: initialMessage,
          });
        
        if (messageError) {
          throw new Error(messageError.message);
        }
      }
      
      return threadData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-threads'] });
      toast({
        title: "Conversa criada",
        description: "Nova conversa iniciada com sucesso",
      });
    },
    onError: (error) => {
      console.error('Error creating message thread:', error);
      toast({
        title: "Erro ao criar conversa",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Mark thread messages as read
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

// Get total unread messages count across all threads
export const useUnreadMessagesCount = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['unread-messages-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      // Get threads where the user is a participant
      const { data: threads, error: threadsError } = await supabase
        .from('message_threads')
        .select('id');
      
      if (threadsError) {
        console.error('Error fetching threads for unread count:', threadsError);
        return 0;
      }
      
      if (!threads.length) return 0;
      
      const threadIds = threads.map(t => t.id);
      
      // Count unread messages in those threads that the user didn't send
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('thread_id', threadIds)
        .eq('is_read', false)
        .neq('sender_id', user.id);
      
      if (error) {
        console.error('Error counting unread messages:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!user?.id,
  });
};

// Mock function to create test threads and messages (for testing only)
export const createMockMessageThread = async () => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) return { success: false, error: 'Usuário não autenticado' };
  
  try {
    // Create a thread
    const { data: threadData, error: threadError } = await supabase
      .from('message_threads')
      .insert({
        title: 'Teste de Conversa',
        created_by: userData.user.id,
        participants: [
          {
            userId: userData.user.id,
            name: 'Eu',
            role: 'admin',
          },
          {
            userId: '00000000-0000-0000-0000-000000000000', // fake user
            name: 'Escola Exemplo',
            role: 'school_admin',
          }
        ],
        thread_type: 'direct',
      })
      .select()
      .single();
    
    if (threadError) throw threadError;
    
    // Create a couple messages
    await supabase.from('messages').insert([
      {
        thread_id: threadData.id,
        sender_id: '00000000-0000-0000-0000-000000000000', // fake user
        content: 'Olá, gostaria de tirar algumas dúvidas sobre o sistema.',
      },
      {
        thread_id: threadData.id,
        sender_id: userData.user.id,
        content: 'Claro, como posso ajudar?',
      }
    ]);
    
    return { success: true };
  } catch (error) {
    console.error('Error creating mock thread:', error);
    return { success: false, error };
  }
};

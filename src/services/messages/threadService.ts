
import { supabase } from "@/integrations/supabase/client";
import { MessageThread, MessageParticipant } from "@/types/message";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { parseParticipants } from "./utils";

/**
 * Hook to fetch message threads for the current user
 */
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
      
      // Ensure data is an array and handle empty results
      const threadData = Array.isArray(data) ? data : [];
      if (threadData.length === 0) return [];
      
      // For each thread, get unread message count
      const threadsWithUnreadCount = await Promise.all(
        threadData.map(async (thread) => {
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
          
          if (!lastMessageError && Array.isArray(lastMessages) && lastMessages.length > 0) {
            // Parse JSON participants safely
            const participantsArray = parseParticipants(thread.participants);
            
            // Find sender info in participants with safe access
            const sender = participantsArray.find(p => 
              p.userId === lastMessages[0].sender_id
            );
            
            lastMessage = {
              content: lastMessages[0].content,
              senderId: lastMessages[0].sender_id,
              senderName: sender ? (sender.name || 'Usuário') : 'Usuário',
            };
          }
          
          // Convert participants from JSON to proper MessageParticipant[] format
          const participants = parseParticipants(thread.participants);
          
          return {
            id: thread.id,
            title: thread.title || '',
            createdBy: thread.created_by,
            createdAt: thread.created_at,
            updatedAt: thread.updated_at,
            lastMessageAt: thread.last_message_at,
            participants,
            threadType: thread.thread_type || 'direct',
            unreadCount: countError ? 0 : (count || 0),
            lastMessage,
          } as MessageThread;
        })
      );
      
      return threadsWithUnreadCount;
    },
    enabled: !!user?.id,
  });
};

/**
 * Hook to create a new message thread
 */
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
      
      // Make sure participants is always an array
      const participantsArray = Array.isArray(participants) ? participants : [];
      
      // Make sure current user is in participants
      const currentUserInParticipants = participantsArray.some(p => p.userId === user.id);
      
      if (!currentUserInParticipants) {
        participantsArray.push({
          userId: user.id,
          name: user.name || 'Eu',
          role: user.role || 'user',
        });
      }
      
      // Map participants to a format the database expects (snake_case keys)
      const dbParticipants = participantsArray.map(p => ({
        user_id: p.userId,
        name: p.name || 'Usuário',
        avatar: p.avatar || null,
        role: p.role || 'user',
        school_id: p.schoolId || null
      }));
      
      // Create thread
      const { data: threadData, error: threadError } = await supabase
        .from('message_threads')
        .insert({
          title,
          created_by: user.id,
          participants: dbParticipants,
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

/**
 * Get total unread messages count across all threads
 */
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
      
      if (!threads || !threads.length) return 0;
      
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

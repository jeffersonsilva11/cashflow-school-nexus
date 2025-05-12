
import { supabase } from "@/integrations/supabase/client";

/**
 * Function to create test threads and messages (for testing only)
 */
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
            user_id: userData.user.id,
            name: 'Eu',
            role: 'admin',
          },
          {
            user_id: '00000000-0000-0000-0000-000000000000', // fake user
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

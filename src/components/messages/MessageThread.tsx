
import { useEffect, useRef, useState } from 'react';
import { Send, PaperclipIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types/message';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useThreadMessages, useSendMessage, useMarkThreadMessagesAsRead } from '@/services/messages';
import { useAuth } from '@/contexts/AuthContext';

interface MessageThreadProps {
  threadId: string;
}

export const MessageThread = ({ threadId }: MessageThreadProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    data: messages = [], 
    isLoading: loadingMessages,
    refetch: refetchMessages
  } = useThreadMessages(threadId);
  
  const { mutate: sendMessage, isPending: sendingMessage } = useSendMessage();
  const { mutate: markAsRead } = useMarkThreadMessagesAsRead();
  
  // Mark messages as read when threadId changes
  useEffect(() => {
    if (threadId) {
      markAsRead(threadId);
    }
  }, [threadId, markAsRead]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessage(
      { threadId, content: message },
      {
        onSuccess: () => {
          setMessage('');
          refetchMessages();
        }
      }
    );
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (loadingMessages) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Carregando mensagens...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma mensagem ainda. Comece a conversa!</p>
            </div>
          ) : (
            messages.map((msg: Message) => {
              const isOwn = msg.senderId === user?.id;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                    {!isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.senderAvatar || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(msg.senderName || 'User')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div>
                      {!isOwn && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {msg.senderName}
                        </p>
                      )}
                      <div className={`rounded-lg px-3 py-2 text-sm ${
                        isOwn 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {msg.content}
                      </div>
                      <p className={`text-xs mt-1 text-muted-foreground ${
                        isOwn ? 'text-right' : ''
                      }`}>
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <Textarea
            placeholder="Escreva sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[40px] resize-none"
            rows={1}
          />
          <Button 
            className="shrink-0" 
            onClick={handleSendMessage}
            disabled={!message.trim() || sendingMessage}
          >
            {sendingMessage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

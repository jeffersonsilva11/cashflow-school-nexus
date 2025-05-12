
import { useState, useEffect } from 'react';
import { MessageSquare, Loader2, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMessageThreads, useUnreadMessagesCount } from '@/services/messages';
import { Link } from 'react-router-dom';

export const MessageDropdown = () => {
  const [open, setOpen] = useState(false);
  
  const { data: threads = [], isLoading: loadingThreads, refetch } = useMessageThreads();
  const { data: unreadCount = 0, refetch: refetchCount } = useUnreadMessagesCount();
  
  useEffect(() => {
    if (open) {
      refetch();
      refetchCount();
    }
  }, [open, refetch, refetchCount]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return format(date, "HH:mm", { locale: ptBR });
    }
    
    // If within 6 days
    const diffInDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) {
      return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
    }
    
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };
  
  const getParticipantName = (thread: any) => {
    if (thread.threadType === 'group') {
      return thread.title;
    }
    
    // For direct messages, show the other participant's name
    if (thread.participants && thread.participants.length > 1) {
      return thread.participants[0].name || 'Contato';
    }
    
    return 'Conversa';
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="h-5 w-5 absolute -top-1 -right-1 flex items-center justify-center text-[10px] bg-green-500">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Mensagens</h3>
        </div>
        
        {loadingThreads ? (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="max-h-[350px]">
            {threads.length > 0 ? (
              threads.slice(0, 5).map((thread) => (
                <Link to={`/messages/${thread.id}`} key={thread.id} onClick={() => setOpen(false)}>
                  <div className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${thread.unreadCount ? 'bg-blue-50' : ''}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(getParticipantName(thread))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm truncate">
                          {getParticipantName(thread)}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDate(thread.lastMessageAt)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground truncate mt-0.5">
                        {thread.lastMessage ? (
                          <>
                            <span className="font-medium">{thread.lastMessage.senderName}:</span> {thread.lastMessage.content}
                          </>
                        ) : (
                          <span className="italic">Nova conversa</span>
                        )}
                      </div>
                      
                      {thread.unreadCount > 0 && (
                        <Badge variant="outline" className="bg-blue-500 text-white border-0 text-[10px] mt-1">
                          {thread.unreadCount} {thread.unreadCount === 1 ? 'nova mensagem' : 'novas mensagens'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <UserCircle2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>Nenhuma conversa encontrada</p>
              </div>
            )}
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator />
        <Link to="/messages" onClick={() => setOpen(false)}>
          <DropdownMenuItem className="cursor-pointer justify-center font-medium text-primary">
            Ver todas as mensagens
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageThread as MessageThreadComponent } from '@/components/messages/MessageThread';
import { NewThreadDialog } from '@/components/messages/NewThreadDialog';
import { 
  PlusCircle, Search, MessageCircle, UserCircle2, Users, ArrowRight, 
  Clock, CheckCheck, AlertCircle, Loader2 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMessageThreads, useMarkThreadMessagesAsRead } from '@/services/messages';
import { MessageThread } from '@/types/message';

const Messages = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isNewThreadDialogOpen, setIsNewThreadDialogOpen] = useState(false);
  
  const { data: threads = [], isLoading: loadingThreads, refetch: refetchThreads } = useMessageThreads();
  const { mutate: markAsRead } = useMarkThreadMessagesAsRead();
  
  // Mark thread as read when selected
  useEffect(() => {
    if (threadId) {
      markAsRead(threadId);
    }
  }, [threadId, markAsRead]);
  
  // Select first thread if none selected
  useEffect(() => {
    if (!loadingThreads && threads.length > 0 && !threadId) {
      navigate(`/messages/${threads[0].id}`);
    }
  }, [loadingThreads, threads, threadId, navigate]);
  
  // Filter threads based on search and activeFilter
  const filteredThreads = threads
    .filter(thread => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      if (searchTerm && !thread.title.toLowerCase().includes(searchLower)) {
        let hasMatchingParticipant = false;
        thread.participants?.forEach(p => {
          if (p.name.toLowerCase().includes(searchLower)) {
            hasMatchingParticipant = true;
          }
        });
        if (!hasMatchingParticipant) return false;
      }
      
      // Tab filter
      if (activeFilter === 'unread' && !thread.unreadCount) return false;
      
      return true;
    });
  
  const handleSelectThread = (thread: MessageThread) => {
    navigate(`/messages/${thread.id}`);
  };
  
  const formatThreadDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return format(date, "HH:mm", { locale: ptBR });
    }
    
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };
  
  const getParticipantName = (thread: MessageThread) => {
    if (thread.threadType === 'group') {
      return thread.title;
    }
    
    // For direct messages, show the other participant's name
    if (thread.participants && thread.participants.length > 0) {
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
    <div className="h-[calc(100vh-6rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
        <p className="text-muted-foreground">
          Gerencie suas conversas com escolas, cantinas e administradores
        </p>
      </div>
      
      <div className="grid grid-cols-12 gap-6 h-[calc(100%-6rem)]">
        {/* Threads List */}
        <div className="col-span-12 md:col-span-4 xl:col-span-3 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversas
              </CardTitle>
              <Button 
                size="sm" 
                className="h-8 gap-1" 
                onClick={() => setIsNewThreadDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4" /> Nova
              </Button>
            </CardHeader>
            
            <div className="px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversas..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="flex-1 flex flex-col">
              <div className="px-4">
                <TabsList className="w-full mb-2">
                  <TabsTrigger value="all" className="flex-1">
                    Todas
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Não lidas
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <CardContent className="p-0 flex-1 overflow-hidden">
                <TabsContent value={activeFilter} className="m-0 h-full">
                  {loadingThreads ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredThreads.length > 0 ? (
                    <ScrollArea className="h-full px-4">
                      <div className="space-y-2 py-2">
                        {filteredThreads.map((thread) => (
                          <div
                            key={thread.id}
                            className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors border ${
                              threadId === thread.id ? 'bg-muted border-primary/50' : 'hover:bg-muted/50'
                            } ${thread.unreadCount ? 'bg-blue-50/50' : ''}`}
                            onClick={() => handleSelectThread(thread)}
                          >
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
                                  {formatThreadDate(thread.lastMessageAt)}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground truncate mt-0.5">
                                {thread.lastMessage ? (
                                  <>
                                    {thread.lastMessage.content}
                                  </>
                                ) : (
                                  <span className="italic">Nova conversa</span>
                                )}
                              </div>
                              
                              {thread.unreadCount > 0 && (
                                <Badge variant="outline" className="bg-blue-500 text-white border-0 text-[10px] mt-1">
                                  {thread.unreadCount} {thread.unreadCount === 1 ? 'não lida' : 'não lidas'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <UserCircle2 className="h-12 w-12 text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">Nenhuma conversa encontrada</h3>
                      <p className="text-muted-foreground text-center mt-1">
                        {searchTerm 
                          ? 'Tente usar outros termos de busca'
                          : activeFilter === 'unread'
                            ? 'Você não tem conversas não lidas'
                            : 'Inicie uma nova conversa para começar'
                        }
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={() => setIsNewThreadDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Nova Conversa
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Message Thread */}
        <div className="col-span-12 md:col-span-8 xl:col-span-9 h-full">
          <Card className="h-full flex flex-col">
            {threadId ? (
              <MessageThreadComponent threadId={threadId} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageCircle className="h-16 w-16 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">Nenhuma conversa selecionada</h3>
                <p className="text-muted-foreground text-center mt-1 max-w-md">
                  Selecione uma conversa da lista ou inicie uma nova conversa para começar
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsNewThreadDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Nova Conversa
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <NewThreadDialog 
        isOpen={isNewThreadDialogOpen}
        onClose={() => setIsNewThreadDialogOpen(false)}
      />
    </div>
  );
};

export default Messages;

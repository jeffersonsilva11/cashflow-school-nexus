
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import { Bell, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  pathname: string;
}

const Header: React.FC<HeaderProps> = ({ pathname }) => {
  const { user } = useAuth();
  
  // Inicializa o título da página baseado na rota atual
  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0 || pathname === '/dashboard') {
      return 'Dashboard';
    }
    
    // Trata diferentes rotas para exibir títulos relevantes
    const firstSegment = pathSegments[0].toLowerCase();
    
    switch (firstSegment) {
      case 'schools': return 'Escolas';
      case 'users': return 'Usuários';
      case 'parents': return 'Responsáveis';
      case 'students': return 'Alunos';
      case 'devices': return 'Dispositivos';
      case 'device-batches': return 'Lotes de Dispositivos';
      case 'transactions': return 'Transações';
      case 'financial': return 'Financeiro';
      case 'analytics': return 'Analytics';
      case 'reports': return 'Relatórios';
      case 'settings': return 'Configurações';
      case 'support': return 'Suporte';
      default: return 'Dashboard';
    }
  };
  
  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur",
    )}>
      <div className="container flex h-full items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          {getPageTitle()}
        </h1>
        
        {user && (
          <div className="flex items-center gap-2">
            {/* Dropdown de notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="h-5 w-5 absolute -top-1 -right-1 flex items-center justify-center text-[10px] bg-red-500">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">Nova inscrição</span>
                      <Badge variant="outline" className="text-[10px]">Agora</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      A Escola Maria Eduarda realizou uma nova inscrição no plano Premium.
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">Dispositivo com pouca bateria</span>
                      <Badge variant="outline" className="text-[10px]">20m</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      O dispositivo DEV-00123 está com menos de 10% de bateria.
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">Falha na transação</span>
                      <Badge variant="outline" className="text-[10px]">2h</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      Houve uma falha na transação #TRX-1234 para o aluno João Silva.
                    </span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-center text-primary">
                  Ver todas as notificações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Botão de mensagens */}
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              <Badge className="h-5 w-5 absolute -top-1 -right-1 flex items-center justify-center text-[10px] bg-green-500">
                2
              </Badge>
            </Button>
            
            {/* Menu do usuário */}
            <UserMenu />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

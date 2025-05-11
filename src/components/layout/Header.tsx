
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { MessageDropdown } from '@/components/messages/MessageDropdown';

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
      case 'notifications': return 'Notificações';
      case 'messages': return 'Mensagens';
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
            <NotificationDropdown />
            
            {/* Dropdown de mensagens */}
            <MessageDropdown />
            
            {/* Menu do usuário */}
            <UserMenu />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

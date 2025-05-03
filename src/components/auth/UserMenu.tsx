
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, School, Shield, UserRound } from 'lucide-react';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  // Função para obter as iniciais do nome do usuário
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getRole = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'school_admin': return 'Admin. Escolar';
      case 'parent': return 'Responsável';
      case 'staff': return 'Funcionário';
      default: return 'Usuário';
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return <Shield className="h-4 w-4 mr-2 text-primary" />;
      case 'school_admin': return <School className="h-4 w-4 mr-2 text-green-500" />;
      case 'parent': return <UserRound className="h-4 w-4 mr-2 text-blue-500" />;
      case 'staff': return <User className="h-4 w-4 mr-2 text-orange-500" />;
      default: return <User className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-9 w-9 border border-primary/10 transition-all hover:border-primary/30">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center mt-2 p-1 rounded-full bg-muted/50 w-fit">
              {getRoleIcon(user.role)}
              <span className="text-xs font-medium">{getRole(user.role)}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="h-4 w-4 mr-2" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => logout()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

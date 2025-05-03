
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define os tipos de usuário do sistema
export type UserRole = 'admin' | 'school_admin' | 'parent' | 'staff';

// Interface para o objeto de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  avatar?: string;
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simula uma API de autenticação
const fakeAuthApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulamos uma chamada de API com um atraso
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Usuários mockados para testes
    const users: Record<string, User> = {
      'admin@example.com': {
        id: 'usr001',
        name: 'Administrador',
        email: 'admin@example.com',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      'escola@example.com': {
        id: 'usr002',
        name: 'Diretor Escola',
        email: 'escola@example.com',
        role: 'school_admin',
        schoolId: 'SCH001',
        avatar: 'https://i.pravatar.cc/150?img=9'
      },
      'pai@example.com': {
        id: 'usr003',
        name: 'José Silva',
        email: 'pai@example.com',
        role: 'parent',
        avatar: 'https://i.pravatar.cc/150?img=7'
      },
      'funcionario@example.com': {
        id: 'usr004',
        name: 'Funcionário',
        email: 'funcionario@example.com',
        role: 'staff',
        schoolId: 'SCH001',
        avatar: 'https://i.pravatar.cc/150?img=11'
      }
    };
    
    const user = users[email];
    
    if (!user || password !== '123456') {
      throw new Error('Credenciais inválidas');
    }
    
    // Salva na localStorage para persistir o login
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },
  
  logout: (): void => {
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
};

// Provedor do contexto de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se o usuário já está autenticado ao carregar
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = fakeAuthApi.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const loggedUser = await fakeAuthApi.login(email, password);
      setUser(loggedUser);
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${loggedUser.name}!`,
      });
      
      // Redireciona com base no tipo de usuário
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro ao realizar login",
        description: error instanceof Error ? error.message : "Ocorreu um erro durante o login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    fakeAuthApi.logout();
    setUser(null);
    navigate('/login');
    
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso",
    });
  };

  // Verifica se o usuário tem permissão baseado em seu papel
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

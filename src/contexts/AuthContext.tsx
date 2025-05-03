
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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

// Provedor do contexto de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Função para transformar o usuário do Supabase no formato necessário para a aplicação
  const formatUserData = async (supaUser: SupabaseUser | null): Promise<User | null> => {
    if (!supaUser) return null;

    try {
      // Obter dados do perfil do usuário da tabela de perfis
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supaUser.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: supaUser.id,
        name: profileData?.name || supaUser.email?.split('@')[0] || 'Usuário',
        email: supaUser.email || '',
        role: profileData?.role || 'parent',
        schoolId: profileData?.school_id,
        avatar: profileData?.avatar_url
      };
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      
      // Retorna um usuário básico mesmo sem perfil
      return {
        id: supaUser.id,
        name: supaUser.email?.split('@')[0] || 'Usuário',
        email: supaUser.email || '',
        role: 'parent',
        avatar: undefined
      };
    }
  };

  // Verificar se o usuário já está autenticado ao carregar
  useEffect(() => {
    // Primeiro, configurar o listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        // Não faz chamadas ao Supabase diretamente no callback para evitar deadlocks
        setTimeout(async () => {
          if (session?.user) {
            const formattedUser = await formatUserData(session.user);
            setUser(formattedUser);
          } else {
            setUser(null);
          }
          setLoading(false);
        }, 0);
      }
    );

    // Em seguida, verificar a sessão atual
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const formattedUser = await formatUserData(session.user);
        setUser(formattedUser);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const formattedUser = await formatUserData(data.user);
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${formattedUser?.name}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao realizar login",
        description: error.message || "Ocorreu um erro durante o login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/login');
      
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao realizar logout",
        description: error.message || "Ocorreu um erro durante o logout",
        variant: "destructive",
      });
    }
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

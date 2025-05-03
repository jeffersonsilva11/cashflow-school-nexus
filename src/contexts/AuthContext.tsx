
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define the types of user roles in the system
export type UserRole = 'admin' | 'school_admin' | 'parent' | 'staff';

// Interface for the user object
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  avatar?: string;
}

// Interface for the authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication context provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to transform the Supabase user into the format needed for the application
  const formatUserData = async (supaUser: SupabaseUser | null): Promise<User | null> => {
    if (!supaUser) return null;

    try {
      // Get user profile data from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supaUser.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }
      
      // Parse role to ensure it's a valid UserRole type
      let userRole: UserRole = 'parent'; // Default role
      
      if (profileData?.role === 'admin' || 
          profileData?.role === 'school_admin' || 
          profileData?.role === 'parent' || 
          profileData?.role === 'staff') {
        userRole = profileData.role as UserRole;
      }

      // Log para depuração
      console.log('[AuthContext] Dados do usuário carregados:', {
        id: supaUser.id,
        email: supaUser.email,
        profileData: profileData,
        role: userRole
      });

      // Ensure role is properly formatted and stored
      const formattedUser: User = {
        id: supaUser.id,
        name: profileData?.name || supaUser.email?.split('@')[0] || 'Usuário',
        email: supaUser.email || '',
        role: userRole,
        schoolId: profileData?.school_id,
        avatar: profileData?.avatar_url
      };

      console.log('[AuthContext] Formatted user object:', formattedUser);
      return formattedUser;
    } catch (error) {
      console.error('Error getting user profile:', error);
      
      // Return a basic user even without a profile
      return {
        id: supaUser.id,
        name: supaUser.email?.split('@')[0] || 'Usuário',
        email: supaUser.email || '',
        role: 'parent', // Default to parent if profile fetching fails
        avatar: undefined
      };
    }
  };

  // Check if the user is already authenticated when loading
  useEffect(() => {
    console.log('[AuthContext] Iniciando verificação de autenticação');
    
    // First, set up a listener for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[AuthContext] Evento de autenticação: ${event}`);
        setSession(session);
        
        // Don't make direct Supabase calls in the callback to avoid deadlocks
        setTimeout(async () => {
          if (session?.user) {
            console.log(`[AuthContext] Usuário autenticado: ${session.user.email}`);
            const formattedUser = await formatUserData(session.user);
            console.log(`[AuthContext] Perfil formatado: ${formattedUser?.role}`);
            setUser(formattedUser);
          } else {
            console.log('[AuthContext] Nenhum usuário autenticado');
            setUser(null);
          }
          setLoading(false);
        }, 0);
      }
    );

    // Then check the current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log(`[AuthContext] Sessão atual: ${session ? 'Existe' : 'Não existe'}`);
      setSession(session);
      
      if (session?.user) {
        const formattedUser = await formatUserData(session.user);
        console.log(`[AuthContext] Usuário da sessão formatado: ${formattedUser?.role}`);
        setUser(formattedUser);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const formattedUser = await formatUserData(data.user);
      
      // Log de depuração do login
      console.log('[AuthContext] Login bem-sucedido:', {
        userId: data.user?.id,
        email: data.user?.email,
        formattedUser
      });
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${formattedUser?.name}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('[AuthContext] Erro no login:', error);
      toast({
        title: "Erro ao realizar login",
        description: error.message || "Ocorreu um erro durante o login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
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

  // Check if the user has permission based on their role
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) {
      console.log('[AuthContext] hasPermission: Nenhum usuário logado');
      return false;
    }
    
    // Log de depuração para verificação de permissões
    console.log(`[AuthContext] Verificando permissão: usuário tem role ${user.role}, precisa de uma das seguintes: ${requiredRoles.join(', ')}`);
    
    // Admin always has access - use lowercase for case insensitivity
    if (user.role.toLowerCase() === 'admin') {
      console.log('[AuthContext] Admin tem permissão para todas as funcionalidades');
      return true;
    }
    
    // Check for specific role
    const hasAccess = requiredRoles.includes(user.role);
    console.log(`[AuthContext] Usuário tem acesso: ${hasAccess}`);
    return hasAccess;
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

// Hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

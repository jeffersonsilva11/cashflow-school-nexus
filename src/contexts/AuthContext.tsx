
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
        .select('name, email, role, school_id, avatar_url')
        .eq('id', supaUser.id)
        .single();

      if (profileError) {
        console.error('[AuthContext] Error fetching profile:', profileError);
        throw profileError;
      }
      
      // Ensure role is properly formatted
      let userRole: UserRole = 'parent'; // Default role
      
      if (profileData?.role) {
        const normalizedRole = profileData.role.toLowerCase();
        if (
          normalizedRole === 'admin' || 
          normalizedRole === 'school_admin' || 
          normalizedRole === 'parent' || 
          normalizedRole === 'staff'
        ) {
          userRole = normalizedRole as UserRole;
        }
      }

      // Debug logging
      console.log('[AuthContext] User data loaded:', {
        id: supaUser.id,
        email: supaUser.email,
        profileData: profileData,
        role: userRole
      });

      // Create formatted user object
      const formattedUser: User = {
        id: supaUser.id,
        name: profileData?.name || supaUser.email?.split('@')[0] || 'Usuário',
        email: profileData?.email || supaUser.email || '',
        role: userRole,
        schoolId: profileData?.school_id,
        avatar: profileData?.avatar_url
      };

      console.log('[AuthContext] Formatted user object:', formattedUser);
      return formattedUser;
    } catch (error) {
      console.error('[AuthContext] Error getting user profile:', error);
      
      // If there's an error with the profile, try a direct role check
      try {
        // Use a direct RPC call to check if user is admin (using our security definer function)
        const { data: isAdminData } = await supabase.rpc('is_admin');
        
        console.log('[AuthContext] Direct admin check result:', isAdminData);
        
        // Return a basic user with the correct role if admin
        return {
          id: supaUser.id,
          name: supaUser.email?.split('@')[0] || 'Usuário',
          email: supaUser.email || '',
          role: isAdminData === true ? 'admin' : 'parent',
          avatar: undefined
        };
      } catch (rpcError) {
        console.error('[AuthContext] Error in direct role check:', rpcError);
        
        // Return a basic user with default role as fallback
        return {
          id: supaUser.id,
          name: supaUser.email?.split('@')[0] || 'Usuário',
          email: supaUser.email || '',
          role: 'parent', // Default fallback role
          avatar: undefined
        };
      }
    }
  };

  // Check if the user is already authenticated when loading
  useEffect(() => {
    console.log('[AuthContext] Starting authentication check');
    
    // First, set up a listener for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[AuthContext] Auth event: ${event}`);
        setSession(session);
        
        // Don't make direct Supabase calls in the callback to avoid deadlocks
        setTimeout(async () => {
          if (session?.user) {
            console.log(`[AuthContext] User authenticated: ${session.user.email}`);
            const formattedUser = await formatUserData(session.user);
            console.log(`[AuthContext] Formatted profile: ${formattedUser?.role}`);
            setUser(formattedUser);
          } else {
            console.log('[AuthContext] No user authenticated');
            setUser(null);
          }
          setLoading(false);
        }, 0);
      }
    );

    // Then check the current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log(`[AuthContext] Current session: ${session ? 'Exists' : 'Does not exist'}`);
      setSession(session);
      
      if (session?.user) {
        try {
          const formattedUser = await formatUserData(session.user);
          console.log(`[AuthContext] Session user formatted: ${formattedUser?.role}`);
          setUser(formattedUser);
        } catch (error) {
          console.error('[AuthContext] Error formatting user data:', error);
          // Ensure loading is turned off even on error
          setUser(null);
        }
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
      
      // Debug login logging
      console.log('[AuthContext] Successful login:', {
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
      console.error('[AuthContext] Login error:', error);
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
      console.log('[AuthContext] hasPermission: No user logged in');
      return false;
    }
    
    // Debug logging for permission checking
    console.log(`[AuthContext] Checking permission: user has role ${user.role}, needs one of: ${requiredRoles.join(', ')}`);
    
    // Admin always has access - ensure case-insensitive comparison
    if (user.role.toLowerCase() === 'admin') {
      console.log('[AuthContext] Admin has permission for all features');
      return true;
    }
    
    // Check for specific role - normalize both sides for case-insensitive comparison
    const userRoleLower = user.role.toLowerCase();
    const hasAccess = requiredRoles.some(role => role.toLowerCase() === userRoleLower);
    console.log(`[AuthContext] User has access: ${hasAccess}`);
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


import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles = ['admin', 'school_admin', 'staff', 'parent'] }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Se ainda está carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Se não está autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Verifica se o usuário tem o papel necessário
  const hasRequiredRole = user ? allowedRoles.includes(user.role) : false;
  
  // Se não tiver permissão, redireciona para uma página de acesso negado
  if (!hasRequiredRole) {
    return <Navigate to="/access-denied" replace />;
  }
  
  // Se tiver autenticação e permissão, renderiza a rota protegida
  return <>{children}</>;
}

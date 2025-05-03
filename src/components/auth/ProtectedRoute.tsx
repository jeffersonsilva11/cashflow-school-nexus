
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se não há roles especificadas ou a lista está vazia, permite o acesso
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Verifica se o usuário tem a role necessária
  if (!allowedRoles.includes(user.role)) {
    console.log(`Acesso negado: Usuário tem role ${user.role}, precisa de uma das seguintes: ${allowedRoles.join(', ')}`);
    return <Navigate to="/access-denied" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

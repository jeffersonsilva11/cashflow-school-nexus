
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

  // Always allow admin users to access any route
  if (user.role === 'admin') {
    console.log('Admin user detected - granting access to all routes');
    return <>{children}</>;
  }

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // For non-admin users, check if they have the required role
  if (!allowedRoles.includes(user.role)) {
    console.log(`Access denied: User has role ${user.role}, but needs one of: ${allowedRoles.join(', ')}`);
    return <Navigate to="/access-denied" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

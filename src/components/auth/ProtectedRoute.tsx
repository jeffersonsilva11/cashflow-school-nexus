
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
    console.log('[ProtectedRoute] Auth loading, showing spinner...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    console.log('[ProtectedRoute] No user logged in, redirecting to login');
    return <Navigate to="/login" />;
  }

  // Debugging user details
  console.log(`[ProtectedRoute] User details: ${user.name} (${user.email}), role: ${user.role}`);
  console.log(`[ProtectedRoute] Required roles: ${allowedRoles.length ? allowedRoles.join(', ') : 'none'}`);

  // Always allow admin users to access any route (always use lowercase comparison)
  if (user.role.toLowerCase() === 'admin') {
    console.log(`[ProtectedRoute] Admin user ${user.name} (${user.email}) detected - granting access to all routes`);
    return <>{children}</>;
  }

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    console.log('[ProtectedRoute] No specific roles required, allowing access');
    return <>{children}</>;
  }

  // For non-admin users, check if they have the required role (case-insensitive)
  const userRoleLower = user.role.toLowerCase();
  if (!allowedRoles.some(role => role.toLowerCase() === userRoleLower)) {
    console.log(`[ProtectedRoute] Access denied: User ${user.name} (${user.email}) has role ${user.role}, but needs one of: ${allowedRoles.join(', ')}`);
    return <Navigate to="/access-denied" />;
  }

  console.log(`[ProtectedRoute] Access granted: User ${user.name} (${user.email}) has required role ${user.role}`);
  return <>{children}</>;
};

export default ProtectedRoute;

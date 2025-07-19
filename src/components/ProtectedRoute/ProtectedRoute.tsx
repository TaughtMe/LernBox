import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  // Wir verwenden den expliziten und flexibleren Typ React.ReactNode
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps): React.ReactNode => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};
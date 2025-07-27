import React from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/*
// --- URSPRÜNGLICHE LOGIK (AUSGEKLAMMERT) ---

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }: ProtectedRouteProps): React.ReactNode => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // Leitet zu einer Login-Seite weiter, wenn der Benutzer nicht angemeldet ist
    return <Navigate to="/login" replace />;
  }

  return children;
};
*/

// --- TEMPORÄRE LÖSUNG (AKTIV) ---
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Da die Login-Seite deaktiviert ist, gewähren wir vorübergehend immer Zugriff.
  return <>{children}</>
}

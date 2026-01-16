import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../../application/usecases/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

/**
 * Componente de proteção de rotas
 * Redireciona para login se usuário não estiver autenticado
 * Opcionalmente verifica role do usuário
 */
export const PrivateRoute = ({ children, requiredRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  console.log('[PrivateRoute] Checking auth state:', { isAuthenticated, path: window.location.pathname });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    // Usuário autenticado mas sem permissão
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

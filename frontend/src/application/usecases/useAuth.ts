import { useAuthStore } from './auth.store.ts';

/**
 * Hook customizado para acesso ao estado de autenticação
 * Simplifica o uso do store nos componentes
 */
const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setUser,
    clearAuth,
    setError,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setUser,
    clearAuth,
    setError,
  };
};

export default useAuth;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AuthService, {
  type LoginCredentials,
  type AuthResponse,
} from '../../infrastructure/api/auth.service';

export interface User {
  id: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
}

/**
 * Store Zustand para gerenciamento de estado de autenticação
 * Persiste token e dados do usuário no localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        console.log('[AuthStore] Login start:', credentials);
        set({ isLoading: true, error: null });

        try {
          const response: AuthResponse = await AuthService.login(credentials);

          // Salvar token no localStorage
          localStorage.setItem('auth_token', response.accessToken);

          const user: User = {
            id: response.userId,
            role: response.role,
          };

          // Salvar dados do usuário
          localStorage.setItem('auth_user', JSON.stringify(user));

          set({
            user,
            token: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('[AuthStore] Login error:', error);
          const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        AuthService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

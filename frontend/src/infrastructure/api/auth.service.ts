import apiClient from './auth-interceptor';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: string;
  role: string;
}

/**
 * Serviço de autenticação - Comunicação com API
 */
export class AuthService {
  /**
   * Realiza login do usuário
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  /**
   * Realiza logout do usuário
   */
  static async logout(): Promise<void> {
    // Limpar dados locais
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export default AuthService;

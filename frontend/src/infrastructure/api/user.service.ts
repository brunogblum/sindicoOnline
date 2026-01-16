import apiClient from './auth-interceptor';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../domain/types/user.types';

/**
 * Serviço de usuários - Comunicação com API
 */
export class UserService {
  /**
   * Lista todos os usuários
   */
  static async listUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  }

  /**
   * Busca um usuário por ID
   */
  static async getUser(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }

  /**
   * Cria um novo usuário
   */
  static async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  }

  /**
   * Atualiza um usuário existente
   */
  static async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Exclui um usuário (soft delete)
   */
  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }
}

export default UserService;

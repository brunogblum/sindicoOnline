import { create } from 'zustand';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../domain/types/user.types';
import { UserService } from '../../infrastructure/api/user.service';

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserRequest) => Promise<void>;
  updateUser: (id: string, data: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await UserService.listUsers();
      set({ users, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar usuários';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createUser: async (data: CreateUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await UserService.createUser(data);
      set((state) => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar usuário';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateUser: async (id: string, data: UpdateUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await UserService.updateUser(id, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        isLoading: false,
        selectedUser: null,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await UserService.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir usuário';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  clearError: () => {
    set({ error: null });
  },
}));

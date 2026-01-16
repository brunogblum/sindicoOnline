import { useUsersStore } from './users.store';

/**
 * Hook customizado para acesso ao estado de usuários
 * Simplifica o uso do store nos componentes
 */
const useUsers = () => {
  const {
    users,
    selectedUser,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setSelectedUser,
    clearError,
  } = useUsersStore();

  return {
    users,
    selectedUser,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setSelectedUser,
    clearError,
  };
};

export default useUsers;

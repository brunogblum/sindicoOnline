import { useEffect, useState } from 'react';
import useUsers from '../../application/usecases/useUsers';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../domain/types/user.types';
import UsersTable from './components/UsersTable';
import UserForm from './components/UserForm';
import './users.css';

export const UsersPage = () => {
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
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    clearError();
  };

  const handleSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data as UpdateUserRequest);
      } else {
        await createUser(data as CreateUserRequest);
      }
      handleCloseModal();
    } catch (err) {
      // Erro já tratado no store
    }
  };

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id);
    } catch (err) {
      // Erro já tratado no store
    }
  };

  return (
    <div className="users-container">
      <div className="users-content">
        <div className="users-header">
          <h1 className="users-title">Gerenciamento de Usuários</h1>
          <button className="btn-primary" onClick={() => handleOpenModal()} disabled={isLoading}>
            + Novo Usuário
          </button>
        </div>

        {error && !isModalOpen && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="users-table-card">
          <UsersTable
            users={users}
            isLoading={isLoading}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <UserForm
              user={selectedUser}
              isLoading={isLoading}
              error={error}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

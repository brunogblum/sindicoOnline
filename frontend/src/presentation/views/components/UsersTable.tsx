import type { User } from '../../../domain/types/user.types';
import { UserRole } from '../../../domain/types/user.types';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const getRoleBadgeClass = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'admin';
    case UserRole.SINDICO:
      return 'sindico';
    case UserRole.MORADOR:
      return 'morador';
    default:
      return '';
  }
};

const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.SINDICO:
      return 'Síndico';
    case UserRole.MORADOR:
      return 'Morador';
    default:
      return role;
  }
};

const formatCPF = (cpf: string): string => {
  // Format: XXX.XXX.XXX-XX
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const UsersTable = ({ users, isLoading, onEdit, onDelete }: UsersTableProps) => {
  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum usuário cadastrado.</p>
        <p>Clique em "Novo Usuário" para adicionar o primeiro usuário.</p>
      </div>
    );
  }

  const handleDelete = (user: User) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
      onDelete(user);
    }
  };

  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Perfil</th>
            <th>Bloco/Apto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{formatCPF(user.cpf)}</td>
              <td>
                <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </td>
              <td>{user.block && user.apartment ? `${user.block} / ${user.apartment}` : '-'}</td>
              <td>
                <div className="table-actions">
                  <button
                    className="btn-icon edit"
                    onClick={() => onEdit(user)}
                    title="Editar usuário"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDelete(user)}
                    title="Excluir usuário"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

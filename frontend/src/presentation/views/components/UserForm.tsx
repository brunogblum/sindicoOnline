import { useState, type FormEvent, useEffect } from 'react';
import { z } from 'zod';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../../domain/types/user.types';
import { UserRole } from '../../../domain/types/user.types';

// Schema de validação com Zod
const createUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z
    .string()
    .regex(
      /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      'CPF inválido (use XXX.XXX.XXX-XX ou 11 dígitos)'
    ),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['ADMIN', 'SINDICO', 'MORADOR']),
  block: z.string().optional(),
  apartment: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  role: z.enum(['ADMIN', 'SINDICO', 'MORADOR']).optional(),
});

interface UserFormProps {
  user?: User | null;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
}

export const UserForm = ({ user, isLoading, error, onSubmit, onCancel }: UserFormProps) => {
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: user?.cpf || '',
    password: '',
    role: user?.role || UserRole.MORADOR,
    block: user?.block || '',
    apartment: user?.apartment || '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        password: '',
        role: user.role,
        block: user.block || '',
        apartment: user.apartment || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpar erro do campo ao digitar
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar formulário
    const schema = isEditing ? updateUserSchema : createUserSchema;
    const dataToValidate = isEditing
      ? {
          name: formData.name,
          ...(formData.password && { password: formData.password }),
          role: formData.role,
        }
      : {
          ...formData,
          cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
        };

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = String(err.path[0]);
        if (field) {
          errors[field] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    try {
      if (isEditing) {
        const updateData: UpdateUserRequest = {
          name: formData.name,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await onSubmit(updateData);
      } else {
        const createData: CreateUserRequest = {
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf.replace(/\D/g, ''),
          password: formData.password,
          role: formData.role,
          ...(formData.block && { block: formData.block }),
          ...(formData.apartment && { apartment: formData.apartment }),
        };
        await onSubmit(createData);
      }
    } catch (err) {
      // Erro já tratado no store
      console.error('Erro ao salvar usuário:', err);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-group full-width">
        <label htmlFor="name" className="form-label required">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-input ${validationErrors.name ? 'error' : ''}`}
          value={formData.name}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Nome completo"
        />
        {validationErrors.name && <span className="error-message">{validationErrors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email" className="form-label required">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${validationErrors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading || isEditing}
            placeholder="email@exemplo.com"
          />
          {validationErrors.email && (
            <span className="error-message">{validationErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cpf" className="form-label required">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            className={`form-input ${validationErrors.cpf ? 'error' : ''}`}
            value={formData.cpf}
            onChange={handleInputChange}
            disabled={isLoading || isEditing}
            placeholder="XXX.XXX.XXX-XX"
          />
          {validationErrors.cpf && <span className="error-message">{validationErrors.cpf}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password" className={`form-label ${!isEditing ? 'required' : ''}`}>
            Senha {isEditing && '(deixe em branco para manter)'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-input ${validationErrors.password ? 'error' : ''}`}
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="••••••••"
          />
          {validationErrors.password && (
            <span className="error-message">{validationErrors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label required">
            Perfil
          </label>
          <select
            id="role"
            name="role"
            className={`form-select ${validationErrors.role ? 'error' : ''}`}
            value={formData.role}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            <option value={UserRole.MORADOR}>Morador</option>
            <option value={UserRole.SINDICO}>Síndico</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
          {validationErrors.role && <span className="error-message">{validationErrors.role}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="block" className="form-label">
            Bloco
          </label>
          <input
            type="text"
            id="block"
            name="block"
            className="form-input"
            value={formData.block}
            onChange={handleInputChange}
            disabled={isLoading || isEditing}
            placeholder="A, B, C..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="apartment" className="form-label">
            Apartamento
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            className="form-input"
            value={formData.apartment}
            onChange={handleInputChange}
            disabled={isLoading || isEditing}
            placeholder="101, 102..."
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading && <span className="loading-spinner"></span>}
          {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;

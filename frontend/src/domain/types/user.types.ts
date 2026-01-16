export const UserRole = {
  ADMIN: 'ADMIN',
  SINDICO: 'SINDICO',
  MORADOR: 'MORADOR',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  block?: string | null;
  apartment?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  cpf: string;
  password: string;
  role: UserRole;
  block?: string;
  apartment?: string;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
  role?: UserRole;
}

import { UserRole } from './src/modules/users/1-domain/entities/user.entity';

export interface TestUser {
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  block: string | null;
  apartment: string | null;
}

export const DEFAULT_TEST_PASSWORD = 'test123';

export const TEST_USERS: TestUser[] = [
  {
    name: 'Administrador do Sistema',
    email: 'admin@sindicoonline.com',
    cpf: '00000000000',
    role: UserRole.ADMIN,
    block: null,
    apartment: null,
  },
  {
    name: 'Síndico João Silva',
    email: 'sindico@sindicoonline.com',
    cpf: '11111111111',
    role: UserRole.SINDICO,
    block: null,
    apartment: null,
  },
  {
    name: 'Morador Maria Santos',
    email: 'morador@sindicoonline.com',
    cpf: '22222222222',
    role: UserRole.MORADOR,
    block: 'Bloco A',
    apartment: '101',
  },
  {
    name: 'Morador Pedro Oliveira',
    email: 'morador2@sindicoonline.com',
    cpf: '33333333333',
    role: UserRole.MORADOR,
    block: 'Bloco B',
    apartment: '202',
  },
  {
    name: 'Moradora Ana Costa',
    email: 'morador3@sindicoonline.com',
    cpf: '44444444444',
    role: UserRole.MORADOR,
    block: 'Bloco A',
    apartment: '102',
  },
];

export const getTestUserByRole = (role: UserRole): TestUser | undefined => {
  return TEST_USERS.find(user => user.role === role);
};

export const getTestUserByEmail = (email: string): TestUser | undefined => {
  return TEST_USERS.find(user => user.email === email);
};

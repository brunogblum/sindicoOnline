import { UserRole } from '../../1-domain/entities/user.entity';

export interface CreateUserDto {
    name: string;
    email: string;
    cpf: string;
    password: string;
    role: UserRole;
    block?: string;
    apartment?: string;
}

export interface UpdateUserDto {
    id: string;
    name?: string;
    password?: string;
    role?: UserRole;
}

export interface UserOutputDto {
    id: string;
    name: string;
    email: string;
    cpf: string;
    role: UserRole;
    block?: string | null;
    apartment?: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

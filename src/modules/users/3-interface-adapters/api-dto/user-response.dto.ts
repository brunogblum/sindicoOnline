import { UserRole } from '../../1-domain/entities/user.entity';

export class UserResponseDto {
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

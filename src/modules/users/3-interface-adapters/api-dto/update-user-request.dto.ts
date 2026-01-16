import { IsString, IsEnum, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../../1-domain/entities/user.entity';

export class UpdateUserRequestDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @IsOptional()
    name?: string;

    @IsString({ message: 'A senha deve ser uma string' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    @IsOptional()
    password?: string;

    @IsEnum(UserRole, { message: 'Role inválida. Valores permitidos: ADMIN, SINDICO, MORADOR' })
    @IsOptional()
    role?: UserRole;
}

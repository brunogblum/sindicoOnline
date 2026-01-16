import { IsString, IsEmail, IsEnum, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '../../1-domain/entities/user.entity';

export class CreateUserRequestDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    name: string;

    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    email: string;

    @IsString({ message: 'O CPF deve ser uma string' })
    @IsNotEmpty({ message: 'O CPF é obrigatório' })
    // TODO: Add proper algorithmic CPF validation (custom validator)
    cpf: string;

    @IsString({ message: 'Bloco deve ser uma string' })
    @IsOptional()
    block?: string;

    @IsString({ message: 'Apartamento deve ser uma string' })
    @IsOptional()
    apartment?: string;

    @IsString({ message: 'A senha deve ser uma string' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    password: string;

    @IsEnum(UserRole, { message: 'Role inválida. Valores permitidos: ADMIN, SINDICO, MORADOR' })
    @IsNotEmpty({ message: 'Role é obrigatória' })
    role: UserRole;
}

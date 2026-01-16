import { Controller, Post, Body, Inject, Get, Param, Put, Delete, UseGuards, UnauthorizedException, ForbiddenException, Req } from '@nestjs/common';
import { USERS_TOKENS } from '../../4-infrastructure/di/users.tokens';
import { CreateUserUseCase } from '../../2-application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../../2-application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from '../../2-application/use-cases/delete-user.usecase';
import { FindUserUseCase } from '../../2-application/use-cases/find-user.usecase';
import { ListUsersUseCase } from '../../2-application/use-cases/list-users.usecase';
import { CreateUserRequestDto } from '../api-dto/create-user-request.dto';
import { UpdateUserRequestDto } from '../api-dto/update-user-request.dto';
import { UserResponseDto } from '../api-dto/user-response.dto';
import { JwtAuthGuard } from '../../../auth/3-interface-adapters/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/3-interface-adapters/guards/roles.guard';
import { Roles } from '../../../auth/3-interface-adapters/decorators/roles.decorator';
import { UserRole } from '../../1-domain/entities/user.entity';

@Controller('users')
export class UserController {
    constructor(
        @Inject(USERS_TOKENS.CREATE_USER_USECASE) private readonly createUserUseCase: CreateUserUseCase,
        @Inject(USERS_TOKENS.UPDATE_USER_USECASE) private readonly updateUserUseCase: UpdateUserUseCase,
        @Inject(USERS_TOKENS.DELETE_USER_USECASE) private readonly deleteUserUseCase: DeleteUserUseCase,
        @Inject(USERS_TOKENS.FIND_USER_USECASE) private readonly findUserUseCase: FindUserUseCase,
        @Inject(USERS_TOKENS.LIST_USERS_USECASE) private readonly listUsersUseCase: ListUsersUseCase,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SINDICO)
    async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {

        const result = await this.createUserUseCase.execute({
            name: dto.name,
            email: dto.email,
            cpf: dto.cpf,
            password: dto.password,
            role: dto.role,
            block: dto.block,
            apartment: dto.apartment,
        });

        if (result.isFailure) {
            // Map validation errors vs business errors
            throw new ForbiddenException(result.error); // or BadRequest depending on error
        }

        const value = result.getValue();
        return {
            id: value.id,
            name: value.name,
            email: value.email,
            cpf: value.cpf,
            role: value.role,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
        };
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SINDICO)
    async update(@Param('id') id: string, @Body() dto: UpdateUserRequestDto): Promise<UserResponseDto> {
        const result = await this.updateUserUseCase.execute({
            id,
            ...dto,
        });

        if (result.isFailure) {
            throw new ForbiddenException(result.error);
        }

        const value = result.getValue();
        return {
            id: value.id,
            name: value.name,
            email: value.email,
            cpf: value.cpf,
            role: value.role,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
        };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SINDICO)
    async delete(@Param('id') id: string): Promise<void> {
        const result = await this.deleteUserUseCase.execute(id);

        if (result.isFailure) {
            throw new ForbiddenException(result.error);
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SINDICO)
    async find(@Param('id') id: string): Promise<UserResponseDto> {
        const result = await this.findUserUseCase.execute(id);

        if (result.isFailure) {
            throw new ForbiddenException(result.error); // Or NotFound
        }

        const value = result.getValue();
        return {
            id: value.id,
            name: value.name,
            email: value.email,
            cpf: value.cpf,
            role: value.role,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
        };
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SINDICO)
    async list(): Promise<UserResponseDto[]> {
        const result = await this.listUsersUseCase.execute();

        if (result.isFailure) {
            throw new ForbiddenException(result.error);
        }

        return result.getValue().map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            cpf: u.cpf,
            role: u.role,
            block: u.block,
            apartment: u.apartment,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
        }));
    }
}

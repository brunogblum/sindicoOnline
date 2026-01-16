import { Provider } from '@nestjs/common';
import { USERS_TOKENS } from './users.tokens';

import { UserPrismaRepository } from '../repository-adapters/user-prisma.repository';
import { BcryptPasswordHasher } from '../services/bcrypt-password-hasher.service';
import { LoggerService } from '../services/logger.service';

import { CreateUserUseCase } from '../../2-application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../../2-application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from '../../2-application/use-cases/delete-user.usecase';
import { FindUserUseCase } from '../../2-application/use-cases/find-user.usecase';
import { ListUsersUseCase } from '../../2-application/use-cases/list-users.usecase';

import { PrismaService } from '../../../prisma/prisma.service';
import { UserRepositoryContract } from '../../1-domain/contracts/user.repository.contract';
import { PasswordHasherContract } from '../../1-domain/contracts/password-hasher.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';

// Factories
export const createUserRepositoryFactory = (prisma: PrismaService, logger: LoggerContract) => {
    return new UserPrismaRepository(prisma, logger);
};

export const createCreateUserUseCaseFactory = (repo: UserRepositoryContract, hasher: PasswordHasherContract, logger: LoggerContract) => {
    return new CreateUserUseCase(repo, hasher, logger);
};

export const createUpdateUserUseCaseFactory = (repo: UserRepositoryContract, hasher: PasswordHasherContract, logger: LoggerContract) => {
    return new UpdateUserUseCase(repo, hasher, logger);
};

export const createDeleteUserUseCaseFactory = (repo: UserRepositoryContract, logger: LoggerContract) => {
    return new DeleteUserUseCase(repo, logger);
};

export const createFindUserUseCaseFactory = (repo: UserRepositoryContract, logger: LoggerContract) => {
    return new FindUserUseCase(repo, logger);
};

export const createListUsersUseCaseFactory = (repo: UserRepositoryContract, logger: LoggerContract) => {
    return new ListUsersUseCase(repo, logger);
};

export const usersProviders: Provider[] = [
    // Services
    {
        provide: USERS_TOKENS.LOGGER,
        useClass: LoggerService,
    },
    {
        provide: USERS_TOKENS.PASSWORD_HASHER,
        useClass: BcryptPasswordHasher,
    },

    // Repositories
    {
        provide: USERS_TOKENS.USER_REPOSITORY,
        useFactory: createUserRepositoryFactory,
        inject: [PrismaService, USERS_TOKENS.LOGGER],
    },

    // Use Cases
    {
        provide: USERS_TOKENS.CREATE_USER_USECASE,
        useFactory: createCreateUserUseCaseFactory,
        inject: [USERS_TOKENS.USER_REPOSITORY, USERS_TOKENS.PASSWORD_HASHER, USERS_TOKENS.LOGGER],
    },
    {
        provide: USERS_TOKENS.UPDATE_USER_USECASE,
        useFactory: createUpdateUserUseCaseFactory,
        inject: [USERS_TOKENS.USER_REPOSITORY, USERS_TOKENS.PASSWORD_HASHER, USERS_TOKENS.LOGGER],
    },
    {
        provide: USERS_TOKENS.DELETE_USER_USECASE,
        useFactory: createDeleteUserUseCaseFactory,
        inject: [USERS_TOKENS.USER_REPOSITORY, USERS_TOKENS.LOGGER],
    },
    {
        provide: USERS_TOKENS.FIND_USER_USECASE,
        useFactory: createFindUserUseCaseFactory,
        inject: [USERS_TOKENS.USER_REPOSITORY, USERS_TOKENS.LOGGER],
    },
    {
        provide: USERS_TOKENS.LIST_USERS_USECASE,
        useFactory: createListUsersUseCaseFactory,
        inject: [USERS_TOKENS.USER_REPOSITORY, USERS_TOKENS.LOGGER],
    },
];

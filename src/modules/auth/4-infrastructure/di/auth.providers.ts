import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_TOKENS } from './auth.tokens';
import { AuthUserPrismaRepository } from '../repository-adapters/auth-user-prisma.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthenticateUserUseCase } from '../../2-application/use-cases/authenticate-user.usecase';
import { PasswordServiceContract } from '../../1-domain/contracts/password-service.contract';
import { TokenServiceContract } from '../../1-domain/contracts/token-service.contract';
import { AuthUserRepositoryContract } from '../../1-domain/contracts/auth-user.repository.contract';
import { BcryptPasswordService } from '../services/bcrypt-password.service';
import { JwtTokenService } from '../services/jwt-token.service';

/**
 * Factory for AuthenticateUserUseCase
 */
export const authenticateUserUseCaseFactory = (
    userRepo: AuthUserRepositoryContract,
    passwordService: PasswordServiceContract,
    tokenService: TokenServiceContract,
) => {
    return new AuthenticateUserUseCase(userRepo, passwordService, tokenService);
};

export const authProviders: Provider[] = [
    // Infrastructure Services
    {
        provide: AUTH_TOKENS.PASSWORD_SERVICE,
        useClass: BcryptPasswordService,
    },
    {
        provide: AUTH_TOKENS.TOKEN_SERVICE,
        useFactory: (jwtService: JwtService) => {
            return new JwtTokenService(jwtService);
        },
        inject: [JwtService],
    },

    // Repository
    {
        provide: AUTH_TOKENS.AUTH_USER_REPOSITORY,
        useFactory: (prisma: PrismaService) => {
            return new AuthUserPrismaRepository(prisma);
        },
        inject: [PrismaService],
    },

    // Use Cases
    {
        provide: AUTH_TOKENS.AUTHENTICATE_USER_USECASE,
        useFactory: authenticateUserUseCaseFactory,
        inject: [
            AUTH_TOKENS.AUTH_USER_REPOSITORY,
            AUTH_TOKENS.PASSWORD_SERVICE,
            AUTH_TOKENS.TOKEN_SERVICE,
        ],
    },
];

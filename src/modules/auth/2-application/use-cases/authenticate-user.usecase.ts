import { AuthUserRepositoryContract } from '../../1-domain/contracts/auth-user.repository.contract';
import { PasswordServiceContract } from '../../1-domain/contracts/password-service.contract';
import { TokenServiceContract } from '../../1-domain/contracts/token-service.contract';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthenticationResultDto } from '../dto/authentication-result.dto';
import { InvalidCredentialsError } from '../../1-domain/errors/invalid-credentials.error';

export class AuthenticateUserUseCase {
    constructor(
        private readonly userRepository: AuthUserRepositoryContract,
        private readonly passwordService: PasswordServiceContract,
        private readonly tokenService: TokenServiceContract,
    ) { }

    async execute(dto: LoginUserDto): Promise<AuthenticationResultDto> {
        const user = await this.userRepository.findByEmail(dto.email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const isPasswordValid = await this.passwordService.compare(
            dto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }

        const token = await this.tokenService.generateToken(user);

        return new AuthenticationResultDto(token, user.id, user.role);
    }
}

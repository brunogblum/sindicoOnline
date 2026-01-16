import { AuthenticateUserUseCase } from '../../../2-application/use-cases/authenticate-user.usecase';
import { AuthUserRepositoryContract } from '../../../1-domain/contracts/auth-user.repository.contract';
import { PasswordServiceContract } from '../../../1-domain/contracts/password-service.contract';
import { TokenServiceContract } from '../../../1-domain/contracts/token-service.contract';
import { LoginUserDto } from '../../../2-application/dto/login-user.dto';
import { AuthUser, UserRole } from '../../../1-domain/entities/auth-user.entity';

describe('AuthenticateUserUseCase', () => {
    let useCase: AuthenticateUserUseCase;
    let userRepository: jest.Mocked<AuthUserRepositoryContract>;
    let passwordService: jest.Mocked<PasswordServiceContract>;
    let tokenService: jest.Mocked<TokenServiceContract>;

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
        };
        passwordService = {
            hash: jest.fn(),
            compare: jest.fn(),
        };
        tokenService = {
            generateToken: jest.fn(),
            verifyToken: jest.fn(),
        };

        useCase = new AuthenticateUserUseCase(
            userRepository,
            passwordService,
            tokenService,
        );
    });

    it('should authenticate user with valid credentials', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password123';
        const hashedPassword = 'hashedPassword';
        const token = 'jwtToken';
        const user = AuthUser.create('1', email, hashedPassword, 'Test User', UserRole.MORADOR);

        userRepository.findByEmail.mockResolvedValue(user);
        passwordService.compare.mockResolvedValue(true);
        tokenService.generateToken.mockResolvedValue(token);

        const dto = new LoginUserDto(email, password);

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
        expect(passwordService.compare).toHaveBeenCalledWith(password, hashedPassword);
        expect(tokenService.generateToken).toHaveBeenCalledWith(user);
        expect(result.accessToken).toBe(token);
        expect(result.userId).toBe(user.id);
    });

    it('should throw error for invalid email', async () => {
        userRepository.findByEmail.mockResolvedValue(null);
        const dto = new LoginUserDto('wrong@example.com', 'password');

        await expect(useCase.execute(dto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
        const user = AuthUser.create('1', 'test@example.com', 'hashed', 'Test', UserRole.MORADOR);
        userRepository.findByEmail.mockResolvedValue(user);
        passwordService.compare.mockResolvedValue(false);

        const dto = new LoginUserDto('test@example.com', 'wrongpassword');

        await expect(useCase.execute(dto)).rejects.toThrow('Invalid credentials');
    });
});

import { CreateUserUseCase } from '../../../../2-application/use-cases/create-user.usecase';
import { UserRepositoryContract } from '../../../../1-domain/contracts/user.repository.contract';
import { PasswordHasherContract } from '../../../../1-domain/contracts/password-hasher.contract';
import { LoggerContract } from '../../../../1-domain/contracts/logger.contract';
import { UserRole } from '../../../../1-domain/entities/user.entity';

describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase;
    let userRepository: UserRepositoryContract;
    let passwordHasher: PasswordHasherContract;
    let logger: LoggerContract;

    beforeEach(() => {
        userRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
        } as any;

        passwordHasher = {
            hash: jest.fn().mockResolvedValue('hashed_password'),
            compare: jest.fn(),
        };

        logger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        };

        useCase = new CreateUserUseCase(userRepository, passwordHasher, logger);
    });

    it('should create a user successfully', async () => {
        const dto = {
            name: 'John Doe',
            email: 'john@example.com',
            cpf: '12345678900',
            password: 'password123',
            role: UserRole.MORADOR,
            block: 'A',
            apartment: '101',
        };

        (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

        const result = await useCase.execute(dto);

        expect(result.isSuccess).toBe(true);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
        expect(passwordHasher.hash).toHaveBeenCalledWith(dto.password);
        expect(userRepository.save).toHaveBeenCalled();
        const output = result.getValue();
        expect(output.email).toBe(dto.email);
        expect(output.name).toBe(dto.name);
        expect(output.cpf).toBe(dto.cpf);
        expect(output.block).toBe(dto.block);
        expect(output.apartment).toBe(dto.apartment);
    });

    it('should fail if user already exists', async () => {
        const dto = {
            name: 'John Doe',
            email: 'john@example.com',
            cpf: '12345678900',
            password: 'password123',
            role: UserRole.MORADOR,
        };

        (userRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 'existing' });

        const result = await useCase.execute(dto);

        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('User with this email already exists');
        expect(userRepository.save).not.toHaveBeenCalled();
    });
});

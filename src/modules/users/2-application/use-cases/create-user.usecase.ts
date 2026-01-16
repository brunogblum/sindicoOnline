import { UserRepositoryContract } from '../../1-domain/contracts/user.repository.contract';
import { PasswordHasherContract } from '../../1-domain/contracts/password-hasher.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { CreateUserDto, UserOutputDto } from '../dto/user.dto';
import { Result } from '../../1-domain/value-objects/result.value-object';
import { User } from '../../1-domain/entities/user.entity';
import { UserMapper } from '../dto/user.mapper';
import { randomUUID } from 'crypto';

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepositoryContract,
        private readonly passwordHasher: PasswordHasherContract,
        private readonly logger: LoggerContract,
    ) { }

    async execute(dto: CreateUserDto): Promise<Result<UserOutputDto>> {
        try {
            this.logger.log('Executing CreateUserUseCase', { email: dto.email });

            const userAlreadyExists = await this.userRepository.findByEmail(dto.email);
            if (userAlreadyExists) {
                return Result.fail('User with this email already exists');
            }

            const passwordHash = await this.passwordHasher.hash(dto.password);
            const id = randomUUID();

            const user = User.create(
                id,
                dto.email,
                dto.cpf,
                passwordHash,
                dto.name,
                dto.role,
                dto.block || null,
                dto.apartment || null,
            );

            await this.userRepository.save(user); // Assumes save handles both insert and update logic or just insert. For now assuming save = insert/upsert.

            this.logger.log('User created successfully', { userId: user.id });

            return Result.ok(UserMapper.toDto(user));
        } catch (error) {
            this.logger.error('Error creating user', (error as Error).stack);
            return Result.fail('Unexpected error creating user');
        }
    }
}

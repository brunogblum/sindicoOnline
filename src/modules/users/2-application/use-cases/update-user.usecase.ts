import { UserRepositoryContract } from '../../1-domain/contracts/user.repository.contract';
import { PasswordHasherContract } from '../../1-domain/contracts/password-hasher.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { UpdateUserDto, UserOutputDto } from '../dto/user.dto';
import { Result } from '../../1-domain/value-objects/result.value-object';
import { UserMapper } from '../dto/user.mapper';

export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepositoryContract,
        private readonly passwordHasher: PasswordHasherContract,
        private readonly logger: LoggerContract,
    ) { }

    async execute(dto: UpdateUserDto): Promise<Result<UserOutputDto>> {
        try {
            this.logger.log('Executing UpdateUserUseCase', { userId: dto.id });

            const user = await this.userRepository.findById(dto.id);
            if (!user) {
                return Result.fail('User not found');
            }

            let newPasswordHash: string | undefined;
            if (dto.password) {
                newPasswordHash = await this.passwordHasher.hash(dto.password);
            }

            const updatedUser = user.update(
                dto.name,
                dto.role,
                newPasswordHash,
            );

            await this.userRepository.save(updatedUser);

            this.logger.log('User updated successfully', { userId: user.id });

            return Result.ok(UserMapper.toDto(updatedUser));
        } catch (error) {
            this.logger.error('Error updating user', (error as Error).stack);
            return Result.fail('Unexpected error updating user');
        }
    }
}

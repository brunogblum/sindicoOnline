import { UserRepositoryContract } from '../../1-domain/contracts/user.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { UserOutputDto } from '../dto/user.dto';
import { Result } from '../../1-domain/value-objects/result.value-object';
import { UserMapper } from '../dto/user.mapper';

export class FindUserUseCase {
    constructor(
        private readonly userRepository: UserRepositoryContract,
        private readonly logger: LoggerContract,
    ) { }

    async execute(userId: string): Promise<Result<UserOutputDto>> {
        try {
            // this.logger.log('Executing FindUserUseCase', { userId }); // Logging read operations might be too verbose

            const user = await this.userRepository.findById(userId);
            if (!user) {
                return Result.fail('User not found');
            }

            return Result.ok(UserMapper.toDto(user));
        } catch (error) {
            this.logger.error('Error finding user', (error as Error).stack);
            return Result.fail('Unexpected error finding user');
        }
    }
}

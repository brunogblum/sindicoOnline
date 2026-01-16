import { UserRepositoryContract } from '../../1-domain/contracts/user.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { Result } from '../../1-domain/value-objects/result.value-object';

export class DeleteUserUseCase {
    constructor(
        private readonly userRepository: UserRepositoryContract,
        private readonly logger: LoggerContract,
    ) { }

    async execute(userId: string): Promise<Result<void>> {
        try {
            this.logger.log('Executing DeleteUserUseCase', { userId });

            const user = await this.userRepository.findById(userId);
            if (!user) {
                return Result.fail('User not found');
            }

            const deletedUser = user.markAsDeleted();
            await this.userRepository.save(deletedUser);

            this.logger.log('User deleted successfully (soft delete)', { userId });

            return Result.ok();
        } catch (error) {
            this.logger.error('Error deleting user', (error as Error).stack);
            return Result.fail('Unexpected error deleting user');
        }
    }
}

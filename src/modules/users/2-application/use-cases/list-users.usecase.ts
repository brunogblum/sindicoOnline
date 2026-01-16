import { UserRepositoryContract } from '../../1-domain/contracts/user.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { UserOutputDto } from '../dto/user.dto';
import { Result } from '../../1-domain/value-objects/result.value-object';
import { UserMapper } from '../dto/user.mapper';

export class ListUsersUseCase {
    constructor(
        private readonly userRepository: UserRepositoryContract,
        private readonly logger: LoggerContract,
    ) { }

    async execute(includeDeleted: boolean = false): Promise<Result<UserOutputDto[]>> {
        try {
            const users = await this.userRepository.findAll(includeDeleted);
            return Result.ok(users.map(UserMapper.toDto));
        } catch (error) {
            this.logger.error('Error listing users', (error as Error).stack);
            return Result.fail('Unexpected error listing users');
        }
    }
}

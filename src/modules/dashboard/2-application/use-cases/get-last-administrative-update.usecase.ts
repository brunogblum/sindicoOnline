import { DashboardRepositoryContract } from '../../1-domain/contracts/dashboard.repository.contract';
import { LastAdministrativeUpdate } from '../../1-domain/value-objects/last-administrative-update.value-object';
import { Result } from '../../1-domain/value-objects/result.value-object';

export class GetLastAdministrativeUpdateUseCase {
    constructor(
        private readonly dashboardRepository: DashboardRepositoryContract
    ) { }

    async execute(userId: string): Promise<Result<LastAdministrativeUpdate | null>> {
        try {
            const lastUpdate = await this.dashboardRepository.getLastAdministrativeUpdate(userId);
            return Result.ok<LastAdministrativeUpdate | null>(lastUpdate);
        } catch (error) {
            return Result.fail<LastAdministrativeUpdate | null>(error);
        }
    }
}

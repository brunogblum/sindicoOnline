import { DashboardRepositoryContract } from '../../1-domain/contracts/dashboard.repository.contract';
import { DashboardMetrics } from '../../1-domain/value-objects/dashboard-metrics.value-object';
import { Result } from '../../1-domain/value-objects/result.value-object';

export class GetDashboardMetricsUseCase {
    constructor(
        private readonly dashboardRepository: DashboardRepositoryContract
    ) { }

    async execute(userId: string, userRole: string): Promise<Result<DashboardMetrics>> {
        try {
            const authorId = userRole === 'MORADOR' ? userId : undefined;
            const metrics = await this.dashboardRepository.getMetrics(authorId);
            return Result.ok<DashboardMetrics>(metrics);
        } catch (error) {
            return Result.fail<DashboardMetrics>(error);
        }
    }
}

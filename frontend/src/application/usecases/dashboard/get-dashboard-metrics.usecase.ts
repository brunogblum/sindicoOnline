import type { DashboardRepositoryContract } from '../../../domain/dashboard/contracts/dashboard.repository.contract';
import type { DashboardMetrics } from '../../../domain/dashboard/dashboard-metrics.entity';

export class GetDashboardMetricsUseCase {
    private readonly dashboardRepository: DashboardRepositoryContract;

    constructor(dashboardRepository: DashboardRepositoryContract) {
        this.dashboardRepository = dashboardRepository;
    }

    async execute(): Promise<DashboardMetrics> {
        return this.dashboardRepository.getMetrics();
    }
}

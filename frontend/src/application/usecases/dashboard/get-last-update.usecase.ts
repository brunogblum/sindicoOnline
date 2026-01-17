import type { DashboardRepositoryContract } from '../../../domain/dashboard/contracts/dashboard.repository.contract';
import type { LastUpdate } from '../../../domain/dashboard/last-update.entity';

export class GetLastUpdateUseCase {
    private readonly dashboardRepository: DashboardRepositoryContract;

    constructor(dashboardRepository: DashboardRepositoryContract) {
        this.dashboardRepository = dashboardRepository;
    }

    async execute(): Promise<LastUpdate | null> {
        try {
            return await this.dashboardRepository.getLastUpdate();
        } catch (error) {
            console.error('Erro ao buscar última atualização:', error);
            return null;
        }
    }
}

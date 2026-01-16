import type { DashboardRepositoryContract } from '../../../domain/dashboard/contracts/dashboard.repository.contract';
import type { DashboardMetrics } from '../../../domain/dashboard/dashboard-metrics.entity';
import { apiClient } from '../api-client';

export class DashboardApiAdapter implements DashboardRepositoryContract {
    async getMetrics(): Promise<DashboardMetrics> {
        const response = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
        return response.data;
    }
}

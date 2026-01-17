import type { DashboardRepositoryContract } from '../../../domain/dashboard/contracts/dashboard.repository.contract';
import type { DashboardMetrics } from '../../../domain/dashboard/dashboard-metrics.entity';
import type { LastUpdate } from '../../../domain/dashboard/last-update.entity';
import { apiClient } from '../api-client';

export class DashboardApiAdapter implements DashboardRepositoryContract {
    async getMetrics(): Promise<DashboardMetrics> {
        const response = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
        return response.data;
    }

    async getLastUpdate(): Promise<LastUpdate | null> {
        const response = await apiClient.get<LastUpdate | null>('/dashboard/last-update');
        const data = response.data;
        if (!data) return null;

        return {
            ...data,
            occurredAt: new Date(data.occurredAt)
        };
    }
}

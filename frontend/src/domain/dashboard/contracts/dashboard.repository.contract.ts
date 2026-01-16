import type { DashboardMetrics } from '../dashboard-metrics.entity';

export interface DashboardRepositoryContract {
    getMetrics(): Promise<DashboardMetrics>;
}

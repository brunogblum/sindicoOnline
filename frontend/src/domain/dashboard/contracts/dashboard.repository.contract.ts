import type { DashboardMetrics } from '../dashboard-metrics.entity';
import type { LastUpdate } from '../last-update.entity';

export interface DashboardRepositoryContract {
    getMetrics(): Promise<DashboardMetrics>;
    getLastUpdate(): Promise<LastUpdate | null>;
}

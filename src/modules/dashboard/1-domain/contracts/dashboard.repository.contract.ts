import { DashboardMetrics } from '../value-objects/dashboard-metrics.value-object';

/**
 * Contrato do repositório de dashboard
 */
export interface DashboardRepositoryContract {
    /**
     * Busca as métricas do dashboard
     */
    getMetrics(authorId?: string): Promise<DashboardMetrics>;
}

import { DashboardMetrics } from '../value-objects/dashboard-metrics.value-object';
import { LastAdministrativeUpdate } from '../value-objects/last-administrative-update.value-object';

/**
 * Contrato do repositório de dashboard
 */
export interface DashboardRepositoryContract {
    /**
     * Busca as métricas do dashboard
     */
    getMetrics(authorId?: string): Promise<DashboardMetrics>;

    /**
     * Busca a última atualização administrativa de uma reclamação do usuário
     */
    getLastAdministrativeUpdate(userId: string): Promise<LastAdministrativeUpdate | null>;
}

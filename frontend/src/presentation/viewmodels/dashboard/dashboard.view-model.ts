import { useState, useEffect } from 'react';
import type { DashboardMetrics } from '../../../domain/dashboard/dashboard-metrics.entity';
import type { LastUpdate } from '../../../domain/dashboard/last-update.entity';
import type { InstitutionalMessage } from '../../../domain/institutional-message/institutional-message.entity';
import { getDashboardMetricsUseCase, getLastUpdateUseCase, getActiveInstitutionalMessageUseCase } from '../../../config/di-container';
import useAuth from '../../../application/usecases/useAuth';

export const useDashboardViewModel = () => {
    const { user } = useAuth();
    const isMorador = user?.role === 'MORADOR';

    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [lastUpdate, setLastUpdate] = useState<LastUpdate | null>(null);
    const [institutionalMessage, setInstitutionalMessage] = useState<InstitutionalMessage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('[Dashboard] isMorador:', isMorador);
            console.log('[Dashboard] Iniciando carregamento de dados...');

            const [metricsData, lastUpdateData, messageData] = await Promise.all([
                getDashboardMetricsUseCase.execute(),
                isMorador ? getLastUpdateUseCase.execute() : Promise.resolve(null),
                isMorador ? getActiveInstitutionalMessageUseCase.execute() : Promise.resolve(null)
            ]);

            console.log('[Dashboard] Metrics:', metricsData);
            console.log('[Dashboard] Last Update:', lastUpdateData);
            console.log('[Dashboard] Institutional Message:', messageData);

            setMetrics(metricsData);
            setLastUpdate(lastUpdateData);
            setInstitutionalMessage(messageData);
        } catch (err: any) {
            console.error('[Dashboard] Erro ao carregar dados:', err);
            setError('Falha ao carregar dados do dashboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    return {
        metrics,
        lastUpdate,
        institutionalMessage,
        loading,
        error,
        reload: loadData
    };
};

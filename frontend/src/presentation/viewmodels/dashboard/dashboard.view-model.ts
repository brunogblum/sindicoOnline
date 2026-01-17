import { useState, useEffect } from 'react';
import type { DashboardMetrics } from '../../../domain/dashboard/dashboard-metrics.entity';
import type { LastUpdate } from '../../../domain/dashboard/last-update.entity';
import { getDashboardMetricsUseCase, getLastUpdateUseCase } from '../../../config/di-container';
import useAuth from '../../../application/usecases/useAuth';

export const useDashboardViewModel = () => {
    const { user } = useAuth();
    const isMorador = user?.role === 'MORADOR';

    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [lastUpdate, setLastUpdate] = useState<LastUpdate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [metricsData, lastUpdateData] = await Promise.all([
                getDashboardMetricsUseCase.execute(),
                isMorador ? getLastUpdateUseCase.execute() : Promise.resolve(null)
            ]);

            setMetrics(metricsData);
            setLastUpdate(lastUpdateData);
        } catch (err: any) {
            console.error(err);
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
        loading,
        error,
        reload: loadData
    };
};

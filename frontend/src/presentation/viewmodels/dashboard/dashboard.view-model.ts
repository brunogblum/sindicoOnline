import { useState, useEffect } from 'react';
import type { DashboardMetrics } from '../../../domain/dashboard/dashboard-metrics.entity';
import { getDashboardMetricsUseCase } from '../../../config/di-container';

export const useDashboardViewModel = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadMetrics = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDashboardMetricsUseCase.execute();
            setMetrics(data);
        } catch (err: any) {
            console.error(err);
            setError('Falha ao carregar dados do dashboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    return {
        metrics,
        loading,
        error,
        reload: loadMetrics
    };
};

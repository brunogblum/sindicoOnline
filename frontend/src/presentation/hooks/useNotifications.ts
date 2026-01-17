import { useState, useEffect } from 'react';
import { getDashboardMetricsUseCase } from '../../config/di-container';
import type { DashboardAlert } from '../../domain/dashboard/dashboard-metrics.entity';
import useAuth from '../../application/usecases/useAuth';

export const useNotifications = () => {
    const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const loadNotifications = async () => {
        if (!user || user.role !== 'MORADOR') {
            setAlerts([]);
            return;
        }

        setLoading(true);
        try {
            const data = await getDashboardMetricsUseCase.execute();
            setAlerts(data.alerts || []);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
        // Refresh every 5 minutes
        const interval = setInterval(loadNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user?.id]);

    return {
        alerts,
        loading,
        refresh: loadNotifications,
        count: alerts.length
    };
};

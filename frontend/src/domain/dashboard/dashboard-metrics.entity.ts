export interface StatusDistribution {
    status: string;
    count: number;
}

export interface CategoryDistribution {
    category: string;
    count: number;
}

export interface DashboardAlert {
    type: 'PENDING_RESPONSE' | 'RECENT_UPDATE';
    message: string;
}

export interface DashboardMetrics {
    statusDistribution: StatusDistribution[];
    categoryDistribution: CategoryDistribution[];
    averageResponseTime: number | null;
    alerts: DashboardAlert[];
}

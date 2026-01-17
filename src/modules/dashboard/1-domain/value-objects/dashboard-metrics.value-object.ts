
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

export class DashboardMetrics {
    readonly statusDistribution: StatusDistribution[];
    readonly categoryDistribution: CategoryDistribution[];
    readonly averageResponseTime: number | null;
    readonly alerts: DashboardAlert[];

    private constructor(props: {
        statusDistribution: StatusDistribution[];
        categoryDistribution: CategoryDistribution[];
        averageResponseTime: number | null;
        alerts: DashboardAlert[];
    }) {
        this.statusDistribution = props.statusDistribution;
        this.categoryDistribution = props.categoryDistribution;
        this.averageResponseTime = props.averageResponseTime;
        this.alerts = props.alerts;
    }

    static create(props: {
        statusDistribution: StatusDistribution[];
        categoryDistribution: CategoryDistribution[];
        averageResponseTime: number | null;
        alerts: DashboardAlert[];
    }): DashboardMetrics {
        return new DashboardMetrics(props);
    }
}

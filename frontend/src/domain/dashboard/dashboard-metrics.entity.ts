export interface StatusDistribution {
    status: string;
    count: number;
}

export interface CategoryDistribution {
    category: string;
    count: number;
}

export interface DashboardMetrics {
    statusDistribution: StatusDistribution[];
    categoryDistribution: CategoryDistribution[];
}

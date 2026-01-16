
export interface StatusDistribution {
    status: string;
    count: number;
}

export interface CategoryDistribution {
    category: string;
    count: number;
}

export class DashboardMetrics {
    readonly statusDistribution: StatusDistribution[];
    readonly categoryDistribution: CategoryDistribution[];

    private constructor(props: { statusDistribution: StatusDistribution[]; categoryDistribution: CategoryDistribution[] }) {
        this.statusDistribution = props.statusDistribution;
        this.categoryDistribution = props.categoryDistribution;
    }

    static create(props: { statusDistribution: StatusDistribution[]; categoryDistribution: CategoryDistribution[] }): DashboardMetrics {
        return new DashboardMetrics(props);
    }
}

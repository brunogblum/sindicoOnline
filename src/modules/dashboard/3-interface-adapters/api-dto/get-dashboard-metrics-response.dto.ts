import { Expose, Type } from 'class-transformer';

export class StatusDistributionDto {
    @Expose()
    status: string;

    @Expose()
    count: number;
}

export class CategoryDistributionDto {
    @Expose()
    category: string;

    @Expose()
    count: number;
}

export class DashboardAlertDto {
    @Expose()
    type: string;

    @Expose()
    message: string;
}

export class GetDashboardMetricsResponseDto {
    @Expose()
    @Type(() => StatusDistributionDto)
    statusDistribution: StatusDistributionDto[];

    @Expose()
    @Type(() => CategoryDistributionDto)
    categoryDistribution: CategoryDistributionDto[];

    @Expose()
    @Type(() => DashboardAlertDto)
    alerts: DashboardAlertDto[];

    @Expose()
    averageResponseTime: number | null;
}

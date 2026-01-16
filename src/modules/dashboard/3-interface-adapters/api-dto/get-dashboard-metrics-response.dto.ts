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

export class GetDashboardMetricsResponseDto {
    @Expose()
    @Type(() => StatusDistributionDto)
    statusDistribution: StatusDistributionDto[];

    @Expose()
    @Type(() => CategoryDistributionDto)
    categoryDistribution: CategoryDistributionDto[];
}

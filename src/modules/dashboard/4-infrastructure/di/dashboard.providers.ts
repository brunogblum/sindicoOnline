import { Provider } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DASHBOARD_TOKENS } from './dashboard.tokens';
import { DashboardPrismaRepository } from '../repository-adapters/dashboard-prisma.repository';
import { DashboardRepositoryContract } from '../../1-domain/contracts/dashboard.repository.contract';
import { GetDashboardMetricsUseCase } from '../../2-application/use-cases/get-dashboard-metrics.usecase';

// Factories
export function createDashboardRepositoryFactory(prisma: PrismaService): DashboardRepositoryContract {
    return new DashboardPrismaRepository(prisma);
}

export function createGetDashboardMetricsUseCaseFactory(dashboardRepository: DashboardRepositoryContract): GetDashboardMetricsUseCase {
    return new GetDashboardMetricsUseCase(dashboardRepository);
}

// Providers
export const dashboardProviders: Provider[] = [
    {
        provide: DASHBOARD_TOKENS.DASHBOARD_REPOSITORY,
        useFactory: createDashboardRepositoryFactory,
        inject: [PrismaService],
    },
    {
        provide: DASHBOARD_TOKENS.GET_DASHBOARD_METRICS_USECASE,
        useFactory: createGetDashboardMetricsUseCaseFactory,
        inject: [DASHBOARD_TOKENS.DASHBOARD_REPOSITORY],
    },
];

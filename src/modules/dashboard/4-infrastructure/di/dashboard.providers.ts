import { Provider } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DASHBOARD_TOKENS } from './dashboard.tokens';
import { DashboardPrismaRepository } from '../repository-adapters/dashboard-prisma.repository';
import { DashboardRepositoryContract } from '../../1-domain/contracts/dashboard.repository.contract';
import { GetDashboardMetricsUseCase } from '../../2-application/use-cases/get-dashboard-metrics.usecase';
import { GetLastAdministrativeUpdateUseCase } from '../../2-application/use-cases/get-last-administrative-update.usecase';

// Factories
export function createDashboardRepositoryFactory(prisma: PrismaService): DashboardRepositoryContract {
    return new DashboardPrismaRepository(prisma);
}

export function createGetDashboardMetricsUseCaseFactory(dashboardRepository: DashboardRepositoryContract): GetDashboardMetricsUseCase {
    return new GetDashboardMetricsUseCase(dashboardRepository);
}

export function createGetLastAdministrativeUpdateUseCaseFactory(dashboardRepository: DashboardRepositoryContract): GetLastAdministrativeUpdateUseCase {
    return new GetLastAdministrativeUpdateUseCase(dashboardRepository);
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
    {
        provide: DASHBOARD_TOKENS.GET_LAST_ADMINISTRATIVE_UPDATE_USECASE,
        useFactory: createGetLastAdministrativeUpdateUseCaseFactory,
        inject: [DASHBOARD_TOKENS.DASHBOARD_REPOSITORY],
    },
];

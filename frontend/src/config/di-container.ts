import { DashboardApiAdapter } from '../infrastructure/api/dashboard/dashboard.api-adapter';
import { GetDashboardMetricsUseCase } from '../application/usecases/dashboard/get-dashboard-metrics.usecase';
import { GetLastUpdateUseCase } from '../application/usecases/dashboard/get-last-update.usecase';
import { InstitutionalMessageApiAdapter } from '../infrastructure/api/institutional-message/institutional-message.api-adapter';
import { createGetActiveInstitutionalMessageUseCase } from '../application/usecases/institutional-message/get-active-institutional-message.usecase';

// Repositories
const dashboardRepository = new DashboardApiAdapter();
const institutionalMessageRepository = new InstitutionalMessageApiAdapter();

// UseCases
export const getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(dashboardRepository);
export const getLastUpdateUseCase = new GetLastUpdateUseCase(dashboardRepository);
export const getActiveInstitutionalMessageUseCase = createGetActiveInstitutionalMessageUseCase(institutionalMessageRepository);

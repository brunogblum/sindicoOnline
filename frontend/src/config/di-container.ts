import { DashboardApiAdapter } from '../infrastructure/api/dashboard/dashboard.api-adapter';
import { GetDashboardMetricsUseCase } from '../application/usecases/dashboard/get-dashboard-metrics.usecase';
import { GetLastUpdateUseCase } from '../application/usecases/dashboard/get-last-update.usecase';

// Repositories
const dashboardRepository = new DashboardApiAdapter();

// UseCases
export const getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(dashboardRepository);
export const getLastUpdateUseCase = new GetLastUpdateUseCase(dashboardRepository);

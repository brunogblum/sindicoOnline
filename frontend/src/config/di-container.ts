import { DashboardApiAdapter } from '../infrastructure/api/dashboard/dashboard.api-adapter';
import { GetDashboardMetricsUseCase } from '../application/usecases/dashboard/get-dashboard-metrics.usecase';

// Repositories
const dashboardRepository = new DashboardApiAdapter();

// UseCases
export const getDashboardMetricsUseCase = new GetDashboardMetricsUseCase(dashboardRepository);

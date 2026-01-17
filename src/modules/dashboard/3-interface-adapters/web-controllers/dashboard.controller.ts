import { Controller, Get, Inject, InternalServerErrorException, UseGuards, Req } from '@nestjs/common';
import { GetDashboardMetricsUseCase } from '../../2-application/use-cases/get-dashboard-metrics.usecase';
import { DASHBOARD_TOKENS } from '../../4-infrastructure/di/dashboard.tokens';
import { GetDashboardMetricsResponseDto } from '../api-dto/get-dashboard-metrics-response.dto';
import { JwtAuthGuard } from '../../../auth/3-interface-adapters/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(
        @Inject(DASHBOARD_TOKENS.GET_DASHBOARD_METRICS_USECASE)
        private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase
    ) { }

    @Get('metrics')
    async getMetrics(@Req() req: any): Promise<GetDashboardMetricsResponseDto> {
        const userId = req.user.id;
        const userRole = req.user.role;
        const result = await this.getDashboardMetricsUseCase.execute(userId, userRole);

        if (result.isFailure) {
            // Em um cenário real, mapearíamos tipos de erro para exceptions corretas (400, 403, etc)
            throw new InternalServerErrorException(result.error);
        }

        const metrics = result.getValue();

        // Mapeamento simples - idealmente usar um mapper
        const response = new GetDashboardMetricsResponseDto();
        response.statusDistribution = metrics.statusDistribution;
        response.categoryDistribution = metrics.categoryDistribution;
        response.averageResponseTime = metrics.averageResponseTime;
        response.alerts = metrics.alerts;

        return response;
    }
}

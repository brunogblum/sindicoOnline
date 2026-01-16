import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DashboardController } from './3-interface-adapters/web-controllers/dashboard.controller';
import { dashboardProviders } from './4-infrastructure/di/dashboard.providers';

@Module({
    imports: [PrismaModule],
    controllers: [DashboardController],
    providers: [
        ...dashboardProviders,
    ],
})
export class DashboardModule { }

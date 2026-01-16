import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { KanbanModule } from './modules/kanban/kanban.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ComplaintsModule,
    DashboardModule,
    KanbanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ComplaintController } from './3-interface-adapters/web-controllers/complaint.controller';
import { InternalCommentController } from './3-interface-adapters/web-controllers/internal-comment.controller';
import { AuditLogController } from './3-interface-adapters/web-controllers/audit-log.controller';
import { complaintsProviders } from './4-infrastructure/di/complaints.providers';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../shared/upload/upload.module';

/**
 * Módulo principal do NestJS para reclamações
 * Configura controllers, providers e dependências
 */
@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [ComplaintController, InternalCommentController, AuditLogController],
  providers: [...complaintsProviders],
  exports: [...complaintsProviders],
})
export class ComplaintsModule {}

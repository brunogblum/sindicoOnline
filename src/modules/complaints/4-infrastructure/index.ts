/**
 * Exports da Camada 4 - Infrastructure (Infraestrutura)
 * Exporta implementações concretas e configurações de DI
 */

// Repository Adapters
export { ComplaintPrismaRepository } from './repository-adapters/complaint-prisma.repository';
export { InternalCommentPrismaRepository } from './repository-adapters/internal-comment-prisma.repository';
export { AuditPrismaRepository } from './repository-adapters/audit-prisma.repository';

// Services
export { ComplaintLoggerService, createComplaintLogger } from './services/complaint-logger.service';

// DI
export { COMPLAINTS_TOKENS } from './di/complaints.tokens';
export {
  complaintsProviders,
  createComplaintRepositoryFactory,
  createCreateComplaintUseCaseFactory,
  createListComplaintsUseCaseFactory
} from './di/complaints.providers';

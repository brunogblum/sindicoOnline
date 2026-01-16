/**
 * Exports da Camada 1 - Domain (Domínio)
 * Exporta todas as entidades, value objects, contratos e serviços de domínio
 */

// Entidades
export { Complaint } from './entities/complaint.entity';
export { ComplaintStatusHistory } from './entities/complaint-status-history.entity';
export { InternalComment } from './entities/internal-comment.entity';
export { AuditLog, AuditAction } from './entities/audit-log.entity';

// Value Objects
export { ComplaintCategory } from './value-objects/complaint-category.value-object';
export { ComplaintUrgency } from './value-objects/complaint-urgency.value-object';
export { ComplaintStatus } from './value-objects/complaint-status.value-object';
export { ComplaintEvidence, SupportedMimeType, MimeTypeMapping } from './value-objects/complaint-evidence.value-object';

// Contratos
export type { ComplaintRepositoryContract } from './contracts/complaint.repository.contract';
export type { ComplaintEvidenceRepositoryContract } from './contracts/complaint-evidence.repository.contract';
export type { InternalCommentRepositoryContract } from './contracts/internal-comment.repository.contract';
export type { AuditRepositoryContract } from './contracts/audit.repository.contract';
export type { LoggerContract } from './contracts/logger.contract';

// Re-export do Result pattern (usado pelos value objects)
export { Result } from '../../users/1-domain/value-objects/result.value-object';

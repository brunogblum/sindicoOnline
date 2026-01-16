/**
 * Exports da Camada 2 - Application (Aplicação)
 * Exporta casos de uso e DTOs
 */

// Casos de uso
export { CreateComplaintUseCase } from './use-cases/create-complaint.usecase';
export { ListComplaintsUseCase } from './use-cases/list-complaints.usecase';
export { UploadEvidenceUseCase } from './use-cases/upload-evidence.usecase';
export { UpdateComplaintStatusUseCase } from './use-cases/update-complaint-status.usecase';
export { AddInternalCommentUseCase } from './use-cases/add-internal-comment.usecase';
export { ListInternalCommentsUseCase } from './use-cases/list-internal-comments.usecase';
export { ListAuditLogsUseCase } from './use-cases/list-audit-logs.usecase';

// DTOs
export type {
  CreateComplaintDto,
  ComplaintFullOutputDto,
  ComplaintLimitedOutputDto,
  ComplaintOwnOutputDto
} from './dto/complaint.dto';

export type {
  ListComplaintsDto,
  ListComplaintsResult
} from './use-cases/list-complaints.usecase';

export type {
  UploadEvidenceDto,
  UploadEvidenceResult
} from './dto/upload-evidence.dto';

// Mappers
export { ComplaintMapper } from './dto/complaint.mapper';

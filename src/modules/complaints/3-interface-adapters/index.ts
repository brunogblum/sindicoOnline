/**
 * Exports da Camada 3 - Interface Adapters (Adaptadores de Interface)
 * Exporta controllers e DTOs de API
 */

// Web Controllers
export { ComplaintController } from './web-controllers/complaint.controller';
export { InternalCommentController } from './web-controllers/internal-comment.controller';
export { AuditLogController } from './web-controllers/audit-log.controller';

// API DTOs
export { CreateComplaintRequestDto } from './api-dto/create-complaint-request.dto';
export { ComplaintOwnResponseDto } from './api-dto/complaint-own-response.dto';
export { ComplaintFullResponseDto } from './api-dto/complaint-full-response.dto';
export { ComplaintLimitedResponseDto } from './api-dto/complaint-limited-response.dto';

// Internal Comments DTOs
export { AddInternalCommentRequestDto } from './api-dto/add-internal-comment-request.dto';
export {
  InternalCommentResponseDto,
  InternalCommentWithAuthorResponseDto,
  ListInternalCommentsResponseDto,
  InternalCommentAuthorDto
} from './api-dto/internal-comment-response.dto';
export { ListInternalCommentsQueryDto } from './api-dto/list-internal-comments-query.dto';

// Audit Logs DTOs
export {
  AuditLogResponseDto,
  AuditLogWithUserResponseDto,
  ListAuditLogsResponseDto,
  AuditLogUserDto
} from './api-dto/audit-log-response.dto';
export { ListAuditLogsQueryDto } from './api-dto/list-audit-logs-query.dto';

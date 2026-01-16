import { Result } from '../../../users/1-domain/value-objects/result.value-object';
import { InternalComment } from '../../1-domain/entities/internal-comment.entity';
import { InternalCommentRepositoryContract } from '../../1-domain/contracts/internal-comment.repository.contract';
import { AuditRepositoryContract } from '../../1-domain/contracts/audit.repository.contract';
import { AuditAction, AuditLog } from '../../1-domain/entities/audit-log.entity';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';

/**
 * Parâmetros de entrada para adicionar comentário interno
 */
export interface AddInternalCommentInput {
  complaintId: string;
  authorId: string;
  content: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Resultado da operação de adicionar comentário interno
 */
export interface AddInternalCommentOutput {
  comment: InternalComment;
  success: boolean;
}

/**
 * Caso de uso para adicionar comentário interno a uma reclamação
 * Apenas usuários com papel de gestor (Admin/Sindico) podem adicionar comentários internos
 */
export class AddInternalCommentUseCase {
  /**
   * Construtor com injeção de dependências
   */
  constructor(
    private readonly internalCommentRepository: InternalCommentRepositoryContract,
    private readonly auditRepository: AuditRepositoryContract,
    private readonly logger: LoggerContract
  ) {}

  /**
   * Executa o caso de uso para adicionar comentário interno
   * @param input - Dados do comentário a ser adicionado
   * @returns Result com o comentário criado ou erro
   */
  async execute(input: AddInternalCommentInput): Promise<Result<AddInternalCommentOutput>> {
    try {
      this.logger.log('Iniciando adição de comentário interno', {
        complaintId: input.complaintId,
        authorId: input.authorId,
        contentLength: input.content.length,
      });

      // Cria a entidade do comentário interno
      const comment = InternalComment.create({
        complaintId: input.complaintId,
        authorId: input.authorId,
        content: input.content,
      });

      // Salva o comentário no repositório
      await this.internalCommentRepository.save(comment);

      this.logger.log('Comentário interno adicionado com sucesso', {
        commentId: comment.id,
        complaintId: input.complaintId,
        authorId: input.authorId,
      });

      // Registra a ação no log de auditoria
      const auditLog = AuditLog.create({
        action: AuditAction.INTERNAL_COMMENT_ADDED,
        entityType: 'complaint',
        entityId: input.complaintId,
        performedBy: input.authorId,
        details: {
          commentId: comment.id,
          contentLength: input.content.length,
        },
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      await this.auditRepository.save(auditLog);

      this.logger.log('Log de auditoria registrado para comentário adicionado', {
        auditLogId: auditLog.id,
        commentId: comment.id,
      });

      return Result.ok({
        comment,
        success: true,
      });

    } catch (error) {
      this.logger.error(
        'Erro ao adicionar comentário interno',
        error instanceof Error ? error.stack : undefined,
        {
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          complaintId: input.complaintId,
          authorId: input.authorId,
        }
      );

      return Result.fail(
        error instanceof Error
          ? error.message
          : 'Erro interno ao adicionar comentário'
      );
    }
  }
}

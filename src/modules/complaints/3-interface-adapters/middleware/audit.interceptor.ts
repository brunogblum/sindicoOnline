import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { COMPLAINTS_TOKENS } from '../../4-infrastructure/di/complaints.tokens';
import type { AuditRepositoryContract } from '../../1-domain/contracts/audit.repository.contract';
import { AuditAction, AuditLog } from '../../1-domain/entities/audit-log.entity';
import type { LoggerContract } from '../../1-domain/contracts/logger.contract';

/**
 * Interceptor para auditoria automática de ações críticas
 * Registra automaticamente ações como mudança de status de reclamações
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject(COMPLAINTS_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepository: AuditRepositoryContract,

    @Inject(COMPLAINTS_TOKENS.LOGGER)
    private readonly logger: LoggerContract,
  ) {}

  /**
   * Intercepta chamadas HTTP e registra ações de auditoria quando necessário
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const handler = context.getHandler();
    const controller = context.getClass();

    // Informações da requisição
    const method = request.method;
    const url = request.url;
    const user = request.user; // Usuário autenticado via JWT
    const ipAddress = request.ip || request.connection?.remoteAddress;
    const userAgent = request.headers['user-agent'];

    // Identifica ações que devem ser auditadas
    const shouldAudit = this.shouldAuditAction(method, url, handler.name);

    if (shouldAudit && user) {
      const auditData = this.extractAuditData(
        method,
        url,
        handler.name,
        request,
        user,
        ipAddress,
        userAgent,
      );

      if (auditData) {
        try {
          // Registra a ação no log de auditoria
          const auditLog = AuditLog.create(auditData);
          await this.auditRepository.save(auditLog);

          this.logger.log('Ação auditada automaticamente', {
            auditLogId: auditLog.id,
            action: auditLog.action,
            entityType: auditLog.entityType,
            entityId: auditLog.entityId,
            performedBy: auditLog.performedBy,
          });
        } catch (error) {
          this.logger.error('Erro ao registrar auditoria automática', error instanceof Error ? error.stack : undefined, {
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            method,
            url,
            userId: user.id,
          });
          // Não interrompe a execução por erro de auditoria
        }
      }
    }

    // Continua a execução normal
    return next.handle().pipe(
      tap((data) => {
        // Aqui poderíamos auditar baseado na resposta também, se necessário
        // Por exemplo, se a resposta contém informações sobre mudanças de status
      }),
    );
  }

  /**
   * Determina se uma ação deve ser auditada
   */
  private shouldAuditAction(
    method: string,
    url: string,
    handlerName: string,
  ): boolean {
    // Audita mudanças de status de reclamações
    if (
      method === 'PATCH' &&
      url.includes('/complaints/') &&
      url.includes('/status')
    ) {
      return true;
    }

    // Audita exclusão de usuários
    if (method === 'DELETE' && url.includes('/users/')) {
      return true;
    }

    // Audita adição de comentários internos
    if (
      method === 'POST' &&
      url.includes('/complaints/internal-comments')
    ) {
      return true;
    }

    // Outras ações críticas podem ser adicionadas aqui
    return false;
  }

  /**
   * Extrai dados de auditoria da requisição
   */
  private extractAuditData(
    method: string,
    url: string,
    handlerName: string,
    request: any,
    user: any,
    ipAddress?: string,
    userAgent?: string,
  ): {
    action: AuditAction;
    entityType: string;
    entityId: string;
    performedBy: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  } | null {
    // Auditoria de mudança de status de reclamação
    if (
      method === 'PATCH' &&
      url.includes('/complaints/') &&
      url.includes('/status')
    ) {
      const complaintId = this.extractComplaintIdFromUrl(url);
      if (!complaintId) return null;

      return {
        action: AuditAction.COMPLAINT_STATUS_CHANGED,
        entityType: 'complaint',
        entityId: complaintId,
        performedBy: user.id,
        details: {
          newStatus: request.body?.status,
          reason: request.body?.reason,
          handlerName,
        },
        ipAddress,
        userAgent,
      };
    }

    // Auditoria de exclusão de usuário
    if (method === 'DELETE' && url.includes('/users/')) {
      const userId = this.extractUserIdFromUrl(url);
      if (!userId) return null;

      return {
        action: AuditAction.USER_DELETED,
        entityType: 'user',
        entityId: userId,
        performedBy: user.id,
        details: {
          handlerName,
        },
        ipAddress,
        userAgent,
      };
    }

    // Auditoria de comentário interno
    if (
      method === 'POST' &&
      url.includes('/complaints/internal-comments')
    ) {
      const complaintId = request.body?.complaintId;
      if (!complaintId) return null;

      return {
        action: AuditAction.INTERNAL_COMMENT_ADDED,
        entityType: 'complaint',
        entityId: complaintId,
        performedBy: user.id,
        details: {
          contentLength: request.body?.content?.length || 0,
          handlerName,
        },
        ipAddress,
        userAgent,
      };
    }

    return null;
  }

  /**
   * Extrai ID da reclamação da URL
   */
  private extractComplaintIdFromUrl(url: string): string | null {
    const match = url.match(/\/complaints\/([a-f0-9\-]+)\/status/);
    return match ? match[1] : null;
  }

  /**
   * Extrai ID do usuário da URL
   */
  private extractUserIdFromUrl(url: string): string | null {
    const match = url.match(/\/users\/([a-f0-9\-]+)/);
    return match ? match[1] : null;
  }
}

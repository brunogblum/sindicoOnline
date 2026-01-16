import { Result } from '../../../users/1-domain/value-objects/result.value-object';
import { AuditRepositoryContract } from '../../1-domain/contracts/audit.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { AuditAction } from '../../1-domain/entities/audit-log.entity';
import {
  AuditLogWithUser,
  PaginatedAuditLogsResult,
  AuditLogFilters,
  AuditLogPaginationParams
} from '../../1-domain/contracts/audit.repository.contract';

/**
 * Parâmetros de entrada para listar logs de auditoria
 */
export interface ListAuditLogsInput {
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  performedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

/**
 * Resultado da operação de listar logs de auditoria
 */
export interface ListAuditLogsOutput {
  logs: AuditLogWithUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Caso de uso para listar logs de auditoria
 * Apenas usuários com papel Admin podem visualizar logs de auditoria
 */
export class ListAuditLogsUseCase {
  /**
   * Construtor com injeção de dependências
   */
  constructor(
    private readonly auditRepository: AuditRepositoryContract,
    private readonly logger: LoggerContract
  ) {}

  /**
   * Executa o caso de uso para listar logs de auditoria
   * @param input - Filtros e paginação para a listagem
   * @returns Result com os logs encontrados ou erro
   */
  async execute(input: ListAuditLogsInput): Promise<Result<ListAuditLogsOutput>> {
    try {
      this.logger.log('Iniciando listagem de logs de auditoria', {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        performedBy: input.performedBy,
        page: input.page,
        limit: input.limit,
      });

      // Define valores padrão para paginação
      const pagination: AuditLogPaginationParams = {
        page: Math.max(1, input.page || 1),
        limit: Math.min(100, Math.max(1, input.limit || 20)), // Máximo 100 por página para admins
      };

      // Monta os filtros
      const filters: AuditLogFilters = {};
      if (input.action) filters.action = input.action;
      if (input.entityType) filters.entityType = input.entityType;
      if (input.entityId) filters.entityId = input.entityId;
      if (input.performedBy) filters.performedBy = input.performedBy;
      if (input.dateFrom) filters.dateFrom = input.dateFrom;
      if (input.dateTo) filters.dateTo = input.dateTo;

      // Busca os logs com filtros e paginação
      const result: PaginatedAuditLogsResult =
        await this.auditRepository.findWithFilters(filters, pagination);

      this.logger.log('Logs de auditoria listados com sucesso', {
        totalLogs: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        appliedFilters: Object.keys(filters).length,
      });

      return Result.ok({
        logs: result.logs,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });

    } catch (error) {
      this.logger.error(
        'Erro ao listar logs de auditoria',
        error instanceof Error ? error.stack : undefined,
        {
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          filters: input,
        }
      );

      return Result.fail(
        error instanceof Error
          ? error.message
          : 'Erro interno ao listar logs de auditoria'
      );
    }
  }
}

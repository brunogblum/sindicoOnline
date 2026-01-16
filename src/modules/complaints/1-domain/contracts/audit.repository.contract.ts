import { AuditLog, AuditAction } from '../entities/audit-log.entity';

/**
 * Parâmetros de paginação para logs de auditoria
 */
export interface AuditLogPaginationParams {
  page: number;
  limit: number;
}

/**
 * Filtros disponíveis para logs de auditoria
 */
export interface AuditLogFilters {
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  performedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  ipAddress?: string;
}

/**
 * Dados do usuário que executou uma ação
 */
export interface AuditLogUserData {
  id: string;
  name: string;
  role: string;
}

/**
 * Log de auditoria com dados do usuário incluídos
 */
export interface AuditLogWithUser {
  log: AuditLog;
  user: AuditLogUserData;
}

/**
 * Resultado paginado de logs de auditoria
 */
export interface PaginatedAuditLogsResult {
  logs: AuditLogWithUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Contrato para operações de persistência de logs de auditoria
 * Define as operações que devem ser implementadas pelo repositório
 */
export interface AuditRepositoryContract {
  /**
   * Salva um log de auditoria no repositório
   * @param log - Log de auditoria a ser salvo
   */
  save(log: AuditLog): Promise<void>;

  /**
   * Busca um log de auditoria pelo ID
   * @param id - ID do log
   * @returns Log encontrado ou null
   */
  findById(id: string): Promise<AuditLog | null>;

  /**
   * Busca logs por ação
   * @param action - Ação a ser filtrada
   * @returns Lista de logs da ação ordenados por data decrescente
   */
  findByAction(action: AuditAction): Promise<AuditLog[]>;

  /**
   * Busca logs por tipo de entidade
   * @param entityType - Tipo da entidade
   * @returns Lista de logs do tipo ordenados por data decrescente
   */
  findByEntityType(entityType: string): Promise<AuditLog[]>;

  /**
   * Busca logs por ID da entidade
   * @param entityId - ID da entidade
   * @returns Lista de logs da entidade ordenados por data decrescente
   */
  findByEntityId(entityId: string): Promise<AuditLog[]>;

  /**
   * Busca logs por usuário que executou a ação
   * @param performedBy - ID do usuário
   * @returns Lista de logs do usuário ordenados por data decrescente
   */
  findByPerformedBy(performedBy: string): Promise<AuditLog[]>;

  /**
   * Busca logs com filtros e paginação
   * @param filters - Filtros a serem aplicados
   * @param pagination - Parâmetros de paginação
   * @returns Resultado paginado de logs
   */
  findWithFilters(
    filters: AuditLogFilters,
    pagination: AuditLogPaginationParams
  ): Promise<PaginatedAuditLogsResult>;

  /**
   * Conta o número de logs por entidade
   * @param entityId - ID da entidade
   * @returns Número de logs
   */
  countByEntityId(entityId: string): Promise<number>;

  /**
   * Busca logs recentes (últimas 24 horas)
   * @param limit - Número máximo de logs a retornar
   * @returns Lista de logs recentes ordenados por data decrescente
   */
  findRecent(limit?: number): Promise<AuditLog[]>;

  /**
   * Limpa logs antigos (mais de X dias)
   * @param daysOld - Idade em dias dos logs a serem removidos
   * @returns Número de logs removidos
   */
  cleanup(daysOld: number): Promise<number>;
}





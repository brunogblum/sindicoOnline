import { AuditAction } from '../../1-domain/entities/audit-log.entity';

/**
 * DTO para dados do usuário que executou uma ação auditada
 */
export class AuditLogUserDto {
  /**
   * ID do usuário
   */
  id!: string;

  /**
   * Nome do usuário
   */
  name!: string;

  /**
   * Papel do usuário (ADMIN, SINDICO, MORADOR)
   */
  role!: string;
}

/**
 * DTO para resposta de log de auditoria
 */
export class AuditLogResponseDto {
  /**
   * ID único do log
   */
  id!: string;

  /**
   * Ação que foi executada
   */
  action!: AuditAction;

  /**
   * Tipo da entidade afetada
   */
  entityType!: string;

  /**
   * ID da entidade afetada
   */
  entityId!: string;

  /**
   * ID do usuário que executou a ação
   */
  performedBy!: string;

  /**
   * Detalhes adicionais da ação
   */
  details?: Record<string, any>;

  /**
   * Endereço IP do usuário
   */
  ipAddress?: string;

  /**
   * User agent do navegador/dispositivo
   */
  userAgent?: string;

  /**
   * Data da execução da ação
   */
  createdAt!: Date;
}

/**
 * DTO para resposta completa de log de auditoria com dados do usuário
 */
export class AuditLogWithUserResponseDto {
  /**
   * Dados do log
   */
  log!: AuditLogResponseDto;

  /**
   * Dados do usuário que executou a ação
   */
  user!: AuditLogUserDto;
}

/**
 * DTO para resposta paginada de logs de auditoria
 */
export class ListAuditLogsResponseDto {
  /**
   * Lista de logs com dados dos usuários
   */
  logs!: AuditLogWithUserResponseDto[];

  /**
   * Número total de logs
   */
  total!: number;

  /**
   * Página atual
   */
  page!: number;

  /**
   * Número de itens por página
   */
  limit!: number;

  /**
   * Número total de páginas
   */
  totalPages!: number;
}





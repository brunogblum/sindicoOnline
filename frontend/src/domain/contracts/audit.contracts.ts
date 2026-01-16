/**
 * Contratos para logs de auditoria
 * Define as interfaces para comunicação com a API
 */

// Tipos de dados para auditoria
export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogUser {
  id: string;
  name: string;
  role: string;
}

export interface AuditLogWithUser {
  log: AuditLog;
  user: AuditLogUser;
}

// DTOs para requisições
export interface ListAuditLogsQuery {
  action?: string;
  entityType?: string;
  entityId?: string;
  performedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// DTOs para respostas
export interface ListAuditLogsResponse {
  logs: AuditLogWithUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Contrato do serviço de auditoria
export interface AuditService {
  /**
   * Lista logs de auditoria com filtros
   */
  listAuditLogs(query?: ListAuditLogsQuery): Promise<ListAuditLogsResponse>;

  /**
   * Lista logs recentes (últimas 24 horas)
   */
  listRecentAuditLogs(): Promise<ListAuditLogsResponse>;
}





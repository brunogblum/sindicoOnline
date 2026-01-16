import type { AuditService } from '../../domain/contracts/audit.contracts';
import { apiClient } from './api-client';

/**
 * Implementação do serviço de auditoria
 * Realiza chamadas HTTP para a API de logs de auditoria
 */
export class AuditApiService implements AuditService {
  /**
   * Lista logs de auditoria com filtros
   */
  async listAuditLogs(query?: {
    action?: string;
    entityType?: string;
    entityId?: string;
    performedBy?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: Array<{
      log: {
        id: string;
        action: string;
        entityType: string;
        entityId: string;
        performedBy: string;
        details?: Record<string, any>;
        ipAddress?: string;
        userAgent?: string;
        createdAt: string;
      };
      user: {
        id: string;
        name: string;
        role: string;
      };
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();

    if (query?.action) params.append('action', query.action);
    if (query?.entityType) params.append('entityType', query.entityType);
    if (query?.entityId) params.append('entityId', query.entityId);
    if (query?.performedBy) params.append('performedBy', query.performedBy);
    if (query?.dateFrom) params.append('dateFrom', query.dateFrom);
    if (query?.dateTo) params.append('dateTo', query.dateTo);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());

    const url = `/admin/audit-logs${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Lista logs recentes (últimas 24 horas)
   */
  async listRecentAuditLogs(): Promise<{
    logs: Array<{
      log: {
        id: string;
        action: string;
        entityType: string;
        entityId: string;
        performedBy: string;
        details?: Record<string, any>;
        ipAddress?: string;
        userAgent?: string;
        createdAt: string;
      };
      user: {
        id: string;
        name: string;
        role: string;
      };
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/admin/audit-logs/recent');
    return response.data;
  }
}

// Instância singleton do serviço
export const auditService = new AuditApiService();





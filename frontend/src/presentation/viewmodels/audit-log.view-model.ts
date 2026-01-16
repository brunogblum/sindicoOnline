import { makeAutoObservable, runInAction } from 'mobx';
import { auditService } from '../../infrastructure/api/audit.service';
import type { AuditLogWithUser } from '../../domain/contracts/audit.contracts';

/**
 * ViewModel para gerenciamento de logs de auditoria
 * Segue o padrão MVVM - gerencia estado e lógica de apresentação
 */
export class AuditLogViewModel {
  // Estado da UI
  public logs: AuditLogWithUser[] = [];
  public isLoading = false;
  public error: string | null = null;

  // Estado de paginação
  public total = 0;
  public page = 1;
  public limit = 20;
  public totalPages = 0;

  // Estado de filtros
  public filters = {
    action: '',
    entityType: '',
    entityId: '',
    performedBy: '',
    dateFrom: '',
    dateTo: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Carrega logs de auditoria com filtros
   */
  async loadAuditLogs(): Promise<void> {
    try {
      runInAction(() => {
        this.isLoading = true;
        this.error = null;
      });

      // Monta query apenas com filtros preenchidos
      const query: any = {
        page: this.page,
        limit: this.limit,
      };

      if (this.filters.action) query.action = this.filters.action;
      if (this.filters.entityType) query.entityType = this.filters.entityType;
      if (this.filters.entityId) query.entityId = this.filters.entityId;
      if (this.filters.performedBy) query.performedBy = this.filters.performedBy;
      if (this.filters.dateFrom) query.dateFrom = this.filters.dateFrom;
      if (this.filters.dateTo) query.dateTo = this.filters.dateTo;

      const response = await auditService.listAuditLogs(query);

      runInAction(() => {
        this.logs = response.logs;
        this.total = response.total;
        this.page = response.page;
        this.limit = response.limit;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar logs';
        this.isLoading = false;
      });
    }
  }

  /**
   * Carrega logs recentes (últimas 24 horas)
   */
  async loadRecentLogs(): Promise<void> {
    try {
      runInAction(() => {
        this.isLoading = true;
        this.error = null;
      });

      const response = await auditService.listRecentAuditLogs();

      runInAction(() => {
        this.logs = response.logs;
        this.total = response.total;
        this.page = response.page;
        this.limit = response.limit;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Erro ao carregar logs recentes';
        this.isLoading = false;
      });
    }
  }

  /**
   * Atualiza um filtro específico
   */
  setFilter(filterName: keyof typeof this.filters, value: string): void {
    this.filters[filterName] = value;
  }

  /**
   * Limpa todos os filtros
   */
  clearFilters(): void {
    this.filters = {
      action: '',
      entityType: '',
      entityId: '',
      performedBy: '',
      dateFrom: '',
      dateTo: '',
    };
    this.page = 1;
  }

  /**
   * Muda a página atual
   */
  setPage(page: number): void {
    this.page = Math.max(1, Math.min(page, this.totalPages));
  }

  /**
   * Limpa mensagens de erro
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Formata data para exibição
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * Formata papel do usuário
   */
  formatRole(role: string): string {
    const roleMap = {
      ADMIN: 'Administrador',
      SINDICO: 'Síndico',
      MORADOR: 'Morador',
    };
    return roleMap[role as keyof typeof roleMap] || role;
  }

  /**
   * Formata ação para exibição legível
   */
  formatAction(action: string): string {
    const actionMap = {
      COMPLAINT_STATUS_CHANGED: 'Status da reclamação alterado',
      COMPLAINT_DELETED: 'Reclamação excluída',
      INTERNAL_COMMENT_ADDED: 'Comentário interno adicionado',
      INTERNAL_COMMENT_UPDATED: 'Comentário interno atualizado',
      INTERNAL_COMMENT_DELETED: 'Comentário interno excluído',
      USER_DELETED: 'Usuário excluído',
    };
    return actionMap[action as keyof typeof actionMap] || action;
  }

  /**
   * Retorna lista de ações disponíveis para filtro
   */
  get availableActions(): Array<{ value: string; label: string }> {
    return [
      { value: 'COMPLAINT_STATUS_CHANGED', label: 'Status da reclamação alterado' },
      { value: 'COMPLAINT_DELETED', label: 'Reclamação excluída' },
      { value: 'INTERNAL_COMMENT_ADDED', label: 'Comentário interno adicionado' },
      { value: 'INTERNAL_COMMENT_UPDATED', label: 'Comentário interno atualizado' },
      { value: 'INTERNAL_COMMENT_DELETED', label: 'Comentário interno excluído' },
      { value: 'USER_DELETED', label: 'Usuário excluído' },
    ];
  }

  /**
   * Retorna lista de tipos de entidade disponíveis para filtro
   */
  get availableEntityTypes(): Array<{ value: string; label: string }> {
    return [
      { value: 'complaint', label: 'Reclamação' },
      { value: 'user', label: 'Usuário' },
    ];
  }

  /**
   * Reseta o estado do ViewModel
   */
  reset(): void {
    this.logs = [];
    this.isLoading = false;
    this.error = null;
    this.total = 0;
    this.page = 1;
    this.limit = 20;
    this.totalPages = 0;
    this.clearFilters();
  }
}





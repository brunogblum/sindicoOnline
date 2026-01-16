import { useComplaintsStore } from '../../application/usecases/complaint.store';
import { useAuthStore } from '../../application/usecases/auth.store';
import type {
  ComplaintFullView,
  ComplaintLimitedView,
  ListComplaintsQuery,
  PaginationInfo,
  ComplaintStatus,
  ComplaintCategory,
  ComplaintUrgency,
  UpdateComplaintStatusRequest
} from '../../domain/entities/complaint.types';

/**
 * ViewModel para o feed de reclamações
 * Coordena a lógica de apresentação e interação com o store
 */
export class ComplaintFeedViewModel {
  constructor() {
    this.initialize();
  }

  // Estado reativo do store
  private get store() {
    return useComplaintsStore.getState();
  }

  // Getters para estado
  get complaints(): ComplaintFullView[] | ComplaintLimitedView[] {
    return this.store.complaints;
  }

  get pagination(): PaginationInfo | null {
    return this.store.pagination;
  }

  get isLoading(): boolean {
    return this.store.isLoading;
  }

  get error(): string | null {
    return this.store.error;
  }

  get userRole(): string {
    const authStore = useAuthStore.getState();
    return authStore.user?.role || '';
  }

  // Estado local do ViewModel
  private currentQuery: ListComplaintsQuery = {
    page: 1,
    limit: 50
  };

  // Filtros aplicados
  private appliedFilters: {
    status?: ComplaintStatus;
    category?: ComplaintCategory;
    urgency?: ComplaintUrgency;
    dateFrom?: string;
    dateTo?: string;
  } = {};

  /**
   * Inicializa o componente carregando as reclamações
   */
  async initialize(): Promise<void> {
    await this.loadComplaints();
  }

  /**
   * Carrega reclamações com filtros atuais
   */
  async loadComplaints(): Promise<void> {
    const query: ListComplaintsQuery = {
      ...this.currentQuery,
      ...this.appliedFilters
    };

    await this.store.fetchComplaintsWithFilters(query);
  }

  /**
   * Aplica filtros e recarrega
   */
  async applyFilters(filters: typeof this.appliedFilters): Promise<void> {
    this.appliedFilters = { ...filters };
    this.currentQuery.page = 1; // Reset para primeira página
    await this.loadComplaints();
  }

  /**
   * Limpa todos os filtros
   */
  async clearFilters(): Promise<void> {
    this.appliedFilters = {};
    this.currentQuery.page = 1;
    await this.loadComplaints();
  }

  /**
   * Muda para uma página específica
   */
  async goToPage(page: number): Promise<void> {
    if (page < 1 || (this.pagination && page > this.pagination.totalPages)) {
      return;
    }

    this.currentQuery.page = page;
    await this.loadComplaints();
  }

  /**
   * Vai para a próxima página
   */
  async nextPage(): Promise<void> {
    if (this.pagination && this.currentQuery.page! < this.pagination.totalPages) {
      this.currentQuery.page!++;
      await this.loadComplaints();
    }
  }

  /**
   * Vai para a página anterior
   */
  async previousPage(): Promise<void> {
    if (this.currentQuery.page! > 1) {
      this.currentQuery.page!--;
      await this.loadComplaints();
    }
  }

  /**
   * Muda o limite de itens por página
   */
  async changePageSize(limit: number): Promise<void> {
    this.currentQuery.limit = limit;
    this.currentQuery.page = 1; // Reset para primeira página
    await this.loadComplaints();
  }

  /**
   * Limpa mensagens de erro
   */
  clearError(): void {
    this.store.clearError();
  }

  /**
   * Verifica se há página anterior
   */
  get hasPreviousPage(): boolean {
    return (this.currentQuery.page || 1) > 1;
  }

  /**
   * Verifica se há próxima página
   */
  get hasNextPage(): boolean {
    return !!(this.pagination && (this.currentQuery.page || 1) < this.pagination.totalPages);
  }

  /**
   * Retorna os filtros aplicados atuais
   */
  get currentFilters(): typeof this.appliedFilters {
    return { ...this.appliedFilters };
  }

  /**
   * Retorna a query atual
   */
  get query(): ListComplaintsQuery {
    return { ...this.currentQuery };
  }

  /**
   * Atualiza o status de uma reclamação
   */
  async updateComplaintStatus(complaintId: string, data: UpdateComplaintStatusRequest): Promise<void> {
    await this.store.updateComplaintStatus(complaintId, data);
  }
}

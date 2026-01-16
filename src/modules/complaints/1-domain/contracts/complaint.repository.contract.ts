import { Complaint } from '../entities/complaint.entity';
import { ComplaintStatusHistory } from '../entities/complaint-status-history.entity';
import { ComplaintCategory } from '../value-objects/complaint-category.value-object';
import { ComplaintUrgency } from '../value-objects/complaint-urgency.value-object';
import { ComplaintStatus } from '../value-objects/complaint-status.value-object';

/**
 * Parâmetros de paginação para listagem de reclamações
 */
export interface ComplaintPaginationParams {
  page: number;
  limit: number;
}

/**
 * Filtros disponíveis para listagem de reclamações
 */
export interface ComplaintFilters {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  urgency?: ComplaintUrgency;
  dateFrom?: Date;
  dateTo?: Date;
  authorId?: string; // Para moradores verem apenas as suas
}

/**
 * Dados do autor de uma reclamação (para exposição controlada)
 */
export interface ComplaintAuthorData {
  id: string;
  name: string;
  block?: string;
  apartment?: string;
}

/**
 * Reclamação com dados do autor incluídos
 */
export interface ComplaintWithAuthor {
  complaint: Complaint;
  author: ComplaintAuthorData | null; // null para casos onde o autor não deve ser exposto
}

/**
 * Resultado paginado de reclamações
 */
export interface PaginatedComplaintsResult {
  complaints: ComplaintWithAuthor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Contrato para operações de persistência de reclamações
 * Define as operações que devem ser implementadas pelo repositório
 */
export interface ComplaintRepositoryContract {
  /**
   * Salva uma reclamação no repositório
   * @param complaint - Reclamação a ser salva
   */
  save(complaint: Complaint): Promise<void>;

  /**
   * Busca uma reclamação pelo ID
   * @param id - ID da reclamação
   * @returns Reclamação encontrada ou null
   */
  findById(id: string): Promise<Complaint | null>;

  /**
   * Busca todas as reclamações de um autor
   * @param authorId - ID do autor
   * @param includeDeleted - Se deve incluir reclamações deletadas
   * @returns Lista de reclamações do autor
   */
  findByAuthorId(authorId: string, includeDeleted?: boolean): Promise<Complaint[]>;

  /**
   * Busca reclamações por categoria
   * @param category - Categoria das reclamações
   * @param includeDeleted - Se deve incluir reclamações deletadas
   * @returns Lista de reclamações da categoria
   */
  findByCategory(category: ComplaintCategory, includeDeleted?: boolean): Promise<Complaint[]>;

  /**
   * Busca reclamações por urgência
   * @param urgency - Urgência das reclamações
   * @param includeDeleted - Se deve incluir reclamações deletadas
   * @returns Lista de reclamações da urgência
   */
  findByUrgency(urgency: ComplaintUrgency, includeDeleted?: boolean): Promise<Complaint[]>;

  /**
   * Busca reclamações por status
   * @param status - Status das reclamações
   * @param includeDeleted - Se deve incluir reclamações deletadas
   * @returns Lista de reclamações do status
   */
  findByStatus(status: ComplaintStatus, includeDeleted?: boolean): Promise<Complaint[]>;

  /**
   * Busca todas as reclamações
   * @param includeDeleted - Se deve incluir reclamações deletadas
   * @returns Lista de todas as reclamações
   */
  findAll(includeDeleted?: boolean): Promise<Complaint[]>;

  /**
   * Conta o número de reclamações por autor em um período
   * @param authorId - ID do autor
   * @param since - Data inicial do período
   * @returns Número de reclamações
   */
  countByAuthorInPeriod(authorId: string, since: Date): Promise<number>;

  /**
   * Busca reclamações com filtros e paginação
   * @param filters - Filtros a serem aplicados
   * @param pagination - Parâmetros de paginação
   * @param includeDeleted - Se deve incluir reclamações deletadas
   * @returns Resultado paginado de reclamações
   */
  findWithFilters(
    filters: ComplaintFilters,
    pagination: ComplaintPaginationParams,
    includeDeleted?: boolean
  ): Promise<PaginatedComplaintsResult>;

  /**
   * Atualiza o status de uma reclamação
   * @param id - ID da reclamação
   * @param newStatus - Novo status
   * @param changedBy - ID do usuário que fez a alteração
   * @param reason - Motivo opcional da alteração
   * @returns Reclamação atualizada ou null se não encontrada
   */
  updateStatus(
    id: string,
    newStatus: ComplaintStatus,
    changedBy: string,
    reason?: string
  ): Promise<Complaint | null>;

  /**
   * Busca o histórico de mudanças de status de uma reclamação
   * @param complaintId - ID da reclamação
   * @returns Lista do histórico de status ordenado por data decrescente
   */
  findStatusHistory(complaintId: string): Promise<ComplaintStatusHistory[]>;
}

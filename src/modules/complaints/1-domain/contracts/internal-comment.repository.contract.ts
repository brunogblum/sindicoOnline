import { InternalComment } from '../entities/internal-comment.entity';

/**
 * Parâmetros de paginação para comentários internos
 */
export interface InternalCommentPaginationParams {
  page: number;
  limit: number;
}

/**
 * Filtros disponíveis para comentários internos
 */
export interface InternalCommentFilters {
  complaintId?: string;
  authorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Dados do autor de um comentário interno
 */
export interface InternalCommentAuthorData {
  id: string;
  name: string;
  role: string;
}

/**
 * Comentário interno com dados do autor incluídos
 */
export interface InternalCommentWithAuthor {
  comment: InternalComment;
  author: InternalCommentAuthorData;
}

/**
 * Resultado paginado de comentários internos
 */
export interface PaginatedInternalCommentsResult {
  comments: InternalCommentWithAuthor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Contrato para operações de persistência de comentários internos
 * Define as operações que devem ser implementadas pelo repositório
 */
export interface InternalCommentRepositoryContract {
  /**
   * Salva um comentário interno no repositório
   * @param comment - Comentário interno a ser salvo
   */
  save(comment: InternalComment): Promise<void>;

  /**
   * Busca um comentário interno pelo ID
   * @param id - ID do comentário
   * @param includeDeleted - Se deve incluir comentários deletados
   * @returns Comentário encontrado ou null
   */
  findById(id: string, includeDeleted?: boolean): Promise<InternalComment | null>;

  /**
   * Busca todos os comentários de uma reclamação
   * @param complaintId - ID da reclamação
   * @param includeDeleted - Se deve incluir comentários deletados
   * @returns Lista de comentários da reclamação ordenados por data decrescente
   */
  findByComplaintId(complaintId: string, includeDeleted?: boolean): Promise<InternalComment[]>;

  /**
   * Busca comentários por autor
   * @param authorId - ID do autor
   * @param includeDeleted - Se deve incluir comentários deletados
   * @returns Lista de comentários do autor ordenados por data decrescente
   */
  findByAuthorId(authorId: string, includeDeleted?: boolean): Promise<InternalComment[]>;

  /**
   * Busca comentários com filtros e paginação
   * @param filters - Filtros a serem aplicados
   * @param pagination - Parâmetros de paginação
   * @param includeDeleted - Se deve incluir comentários deletados
   * @returns Resultado paginado de comentários
   */
  findWithFilters(
    filters: InternalCommentFilters,
    pagination: InternalCommentPaginationParams,
    includeDeleted?: boolean
  ): Promise<PaginatedInternalCommentsResult>;

  /**
   * Conta o número de comentários de uma reclamação
   * @param complaintId - ID da reclamação
   * @param includeDeleted - Se deve incluir comentários deletados
   * @returns Número de comentários
   */
  countByComplaintId(complaintId: string, includeDeleted?: boolean): Promise<number>;

  /**
   * Atualiza um comentário interno
   * @param id - ID do comentário
   * @param updatedComment - Comentário atualizado
   * @returns Comentário atualizado ou null se não encontrado
   */
  update(id: string, updatedComment: InternalComment): Promise<InternalComment | null>;

  /**
   * Remove logicamente um comentário interno
   * @param id - ID do comentário
   * @returns true se o comentário foi marcado como deletado
   */
  delete(id: string): Promise<boolean>;
}





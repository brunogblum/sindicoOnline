/**
 * Contratos para comentários internos
 * Define as interfaces para comunicação com a API
 */

// Tipos de dados para comentários internos
export interface InternalComment {
  id: string;
  complaintId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface InternalCommentAuthor {
  id: string;
  name: string;
  role: string;
}

export interface InternalCommentWithAuthor {
  comment: InternalComment;
  author: InternalCommentAuthor;
}

// DTOs para requisições
export interface AddInternalCommentRequest {
  complaintId: string;
  content: string;
}

export interface ListInternalCommentsQuery {
  complaintId?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}

// DTOs para respostas
export interface AddInternalCommentResponse {
  message: string;
  comment: InternalCommentWithAuthor;
}

export interface ListInternalCommentsResponse {
  comments: InternalCommentWithAuthor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Contrato do serviço de comentários internos
export interface InternalCommentService {
  /**
   * Adiciona um comentário interno a uma reclamação
   */
  addInternalComment(request: AddInternalCommentRequest): Promise<AddInternalCommentResponse>;

  /**
   * Lista comentários internos com filtros
   */
  listInternalComments(query?: ListInternalCommentsQuery): Promise<ListInternalCommentsResponse>;

  /**
   * Lista comentários de uma reclamação específica
   */
  listCommentsByComplaint(complaintId: string): Promise<ListInternalCommentsResponse>;
}





import type { InternalCommentService } from '../../domain/contracts/internal-comment.contracts';
import { apiClient } from './api-client';

/**
 * Implementação do serviço de comentários internos
 * Realiza chamadas HTTP para a API de comentários internos
 */
export class InternalCommentApiService implements InternalCommentService {
  /**
   * Adiciona um comentário interno a uma reclamação
   */
  async addInternalComment(request: {
    complaintId: string;
    content: string;
  }): Promise<{
    message: string;
    comment: {
      comment: {
        id: string;
        complaintId: string;
        authorId: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        deletedAt?: string;
      };
      author: {
        id: string;
        name: string;
        role: string;
      };
    };
  }> {
    const response = await apiClient.post('/complaints/internal-comments', request);
    return response.data;
  }

  /**
   * Lista comentários internos com filtros
   */
  async listInternalComments(query?: {
    complaintId?: string;
    authorId?: string;
    page?: number;
    limit?: number;
    includeDeleted?: boolean;
  }): Promise<{
    comments: Array<{
      comment: {
        id: string;
        complaintId: string;
        authorId: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        deletedAt?: string;
      };
      author: {
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

    if (query?.complaintId) params.append('complaintId', query.complaintId);
    if (query?.authorId) params.append('authorId', query.authorId);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.includeDeleted) params.append('includeDeleted', query.includeDeleted.toString());

    const url = `/complaints/internal-comments${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Lista comentários de uma reclamação específica
   */
  async listCommentsByComplaint(complaintId: string): Promise<{
    comments: Array<{
      comment: {
        id: string;
        complaintId: string;
        authorId: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        deletedAt?: string;
      };
      author: {
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
    const response = await apiClient.get(`/complaints/internal-comments/complaint/${complaintId}`);
    return response.data;
  }
}

// Instância singleton do serviço
export const internalCommentService = new InternalCommentApiService();





import { Result } from '../../../users/1-domain/value-objects/result.value-object';
import { InternalCommentRepositoryContract } from '../../1-domain/contracts/internal-comment.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import {
  InternalCommentWithAuthor,
  PaginatedInternalCommentsResult,
  InternalCommentFilters,
  InternalCommentPaginationParams
} from '../../1-domain/contracts/internal-comment.repository.contract';

/**
 * Parâmetros de entrada para listar comentários internos
 */
export interface ListInternalCommentsInput {
  complaintId?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}

/**
 * Resultado da operação de listar comentários internos
 */
export interface ListInternalCommentsOutput {
  comments: InternalCommentWithAuthor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Caso de uso para listar comentários internos de reclamações
 * Apenas usuários com papel de gestor (Admin/Sindico) podem visualizar comentários internos
 */
export class ListInternalCommentsUseCase {
  /**
   * Construtor com injeção de dependências
   */
  constructor(
    private readonly internalCommentRepository: InternalCommentRepositoryContract,
    private readonly logger: LoggerContract
  ) {}

  /**
   * Executa o caso de uso para listar comentários internos
   * @param input - Filtros e paginação para a listagem
   * @returns Result com os comentários encontrados ou erro
   */
  async execute(input: ListInternalCommentsInput): Promise<Result<ListInternalCommentsOutput>> {
    try {
      this.logger.log('Iniciando listagem de comentários internos', {
        complaintId: input.complaintId,
        authorId: input.authorId,
        page: input.page,
        limit: input.limit,
      });

      // Define valores padrão para paginação
      const pagination: InternalCommentPaginationParams = {
        page: Math.max(1, input.page || 1),
        limit: Math.min(50, Math.max(1, input.limit || 10)), // Máximo 50 por página
      };

      // Monta os filtros
      const filters: InternalCommentFilters = {};
      if (input.complaintId) filters.complaintId = input.complaintId;
      if (input.authorId) filters.authorId = input.authorId;

      // Busca os comentários com filtros e paginação
      const result: PaginatedInternalCommentsResult =
        await this.internalCommentRepository.findWithFilters(
          filters,
          pagination,
          input.includeDeleted
        );

      this.logger.log('Comentários internos listados com sucesso', {
        totalComments: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });

      return Result.ok({
        comments: result.comments,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });

    } catch (error) {
      this.logger.error(
        'Erro ao listar comentários internos',
        error instanceof Error ? error.stack : undefined,
        {
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          complaintId: input.complaintId,
          authorId: input.authorId,
        }
      );

      return Result.fail(
        error instanceof Error
          ? error.message
          : 'Erro interno ao listar comentários'
      );
    }
  }
}

import { PrismaClient } from '@prisma/client';
import { InternalComment } from '../../1-domain/entities/internal-comment.entity';
import { InternalCommentRepositoryContract } from '../../1-domain/contracts/internal-comment.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';

/**
 * Implementação do repositório de comentários internos usando Prisma
 * Criado via factory function para manter pureza das camadas superiores
 */
export class InternalCommentPrismaRepository implements InternalCommentRepositoryContract {
  /**
   * Construtor com injeção de dependências
   */
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: LoggerContract
  ) {}

  /**
   * Salva um comentário interno no banco de dados
   */
  async save(comment: InternalComment): Promise<void> {
    try {
      this.logger.log('Salvando comentário interno no banco de dados', {
        commentId: comment.id,
        complaintId: comment.complaintId,
        authorId: comment.authorId,
      });

      const primitives = comment.toPrimitives();

      await this.prisma.internalComment.create({
        data: {
          id: primitives.id,
          complaintId: primitives.complaintId,
          authorId: primitives.authorId,
          content: primitives.content,
          createdAt: primitives.createdAt,
          updatedAt: primitives.updatedAt,
          deletedAt: primitives.deletedAt,
        },
      });

      this.logger.log('Comentário interno salvo com sucesso', {
        commentId: comment.id,
      });

    } catch (error) {
      this.logger.error('Erro ao salvar comentário interno', error instanceof Error ? error.message : 'Erro desconhecido', {
        commentId: comment.id,
      });
      throw error;
    }
  }

  /**
   * Busca um comentário interno pelo ID
   */
  async findById(id: string, includeDeleted: boolean = false): Promise<InternalComment | null> {
    try {
      this.logger.log('Buscando comentário interno por ID', { id, includeDeleted });

      const whereClause = includeDeleted
        ? { id }
        : { id, deletedAt: null };

      const commentData = await this.prisma.internalComment.findFirst({
        where: whereClause,
      });

      if (!commentData) {
        this.logger.log('Comentário interno não encontrado', { id });
        return null;
      }

      const comment = InternalComment.fromPrimitives({
        id: commentData.id,
        complaintId: commentData.complaintId,
        authorId: commentData.authorId,
        content: commentData.content,
        createdAt: commentData.createdAt,
        updatedAt: commentData.updatedAt,
        deletedAt: commentData.deletedAt ?? undefined,
      });

      this.logger.log('Comentário interno encontrado', { id });
      return comment;

    } catch (error) {
      this.logger.error('Erro ao buscar comentário interno por ID', error instanceof Error ? error.message : 'Erro desconhecido', {
        id,
      });
      throw error;
    }
  }

  /**
   * Busca todos os comentários de uma reclamação
   */
  async findByComplaintId(complaintId: string, includeDeleted: boolean = false): Promise<InternalComment[]> {
    try {
      this.logger.log('Buscando comentários internos por reclamação', {
        complaintId,
        includeDeleted,
      });

      const whereClause = includeDeleted
        ? { complaintId }
        : { complaintId, deletedAt: null };

      const commentsData = await this.prisma.internalComment.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      const comments = commentsData.map(data =>
        InternalComment.fromPrimitives({
          id: data.id,
          complaintId: data.complaintId,
          authorId: data.authorId,
          content: data.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          deletedAt: data.deletedAt ?? undefined,
        })
      );

      this.logger.log('Comentários internos encontrados', {
        complaintId,
        count: comments.length,
      });

      return comments;

    } catch (error) {
      this.logger.error('Erro ao buscar comentários internos por reclamação', error instanceof Error ? error.message : 'Erro desconhecido', {
        complaintId,
      });
      throw error;
    }
  }

  /**
   * Busca comentários por autor
   */
  async findByAuthorId(authorId: string, includeDeleted: boolean = false): Promise<InternalComment[]> {
    try {
      this.logger.log('Buscando comentários internos por autor', {
        authorId,
        includeDeleted,
      });

      const whereClause = includeDeleted
        ? { authorId }
        : { authorId, deletedAt: null };

      const commentsData = await this.prisma.internalComment.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      const comments = commentsData.map(data =>
        InternalComment.fromPrimitives({
          id: data.id,
          complaintId: data.complaintId,
          authorId: data.authorId,
          content: data.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          deletedAt: data.deletedAt ?? undefined,
        })
      );

      this.logger.log('Comentários internos encontrados por autor', {
        authorId,
        count: comments.length,
      });

      return comments;

    } catch (error) {
      this.logger.error('Erro ao buscar comentários internos por autor', error instanceof Error ? error.message : 'Erro desconhecido', {
        authorId,
      });
      throw error;
    }
  }

  /**
   * Busca comentários com filtros e paginação
   */
  async findWithFilters(
    filters: any,
    pagination: any,
    includeDeleted: boolean = false
  ): Promise<any> {
    try {
      this.logger.log('Buscando comentários internos com filtros', {
        filters,
        pagination,
        includeDeleted,
      });

      const whereClause: any = {};
      if (!includeDeleted) {
        whereClause.deletedAt = null;
      }
      if (filters.complaintId) whereClause.complaintId = filters.complaintId;
      if (filters.authorId) whereClause.authorId = filters.authorId;
      if (filters.dateFrom || filters.dateTo) {
        whereClause.createdAt = {};
        if (filters.dateFrom) whereClause.createdAt.gte = filters.dateFrom;
        if (filters.dateTo) whereClause.createdAt.lte = filters.dateTo;
      }

      const [commentsData, total] = await Promise.all([
        this.prisma.internalComment.findMany({
          where: whereClause,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
        }),
        this.prisma.internalComment.count({ where: whereClause }),
      ]);

      const comments = commentsData.map(data => ({
        comment: InternalComment.fromPrimitives({
          id: data.id,
          complaintId: data.complaintId,
          authorId: data.authorId,
          content: data.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          deletedAt: data.deletedAt ?? undefined,
        }),
        author: {
          id: data.author.id,
          name: data.author.name,
          role: data.author.role,
        },
      }));

      const totalPages = Math.ceil(total / pagination.limit);

      this.logger.log('Comentários internos encontrados com filtros', {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
      });

      return {
        comments,
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
      };

    } catch (error) {
      this.logger.error('Erro ao buscar comentários internos com filtros', error instanceof Error ? error.message : 'Erro desconhecido', {
        filters,
        pagination,
      });
      throw error;
    }
  }

  /**
   * Conta o número de comentários de uma reclamação
   */
  async countByComplaintId(complaintId: string, includeDeleted: boolean = false): Promise<number> {
    try {
      const whereClause = includeDeleted
        ? { complaintId }
        : { complaintId, deletedAt: null };

      const count = await this.prisma.internalComment.count({ where: whereClause });

      this.logger.log('Contagem de comentários internos por reclamação', {
        complaintId,
        count,
        includeDeleted,
      });

      return count;

    } catch (error) {
      this.logger.error('Erro ao contar comentários internos por reclamação', error instanceof Error ? error.message : 'Erro desconhecido', {
        complaintId,
      });
      throw error;
    }
  }

  /**
   * Atualiza um comentário interno
   */
  async update(id: string, updatedComment: InternalComment): Promise<InternalComment | null> {
    try {
      this.logger.log('Atualizando comentário interno', { id });

      const primitives = updatedComment.toPrimitives();

      const updatedData = await this.prisma.internalComment.update({
        where: { id },
        data: {
          content: primitives.content,
          updatedAt: primitives.updatedAt,
        },
      });

      const comment = InternalComment.fromPrimitives({
        id: updatedData.id,
        complaintId: updatedData.complaintId,
        authorId: updatedData.authorId,
        content: updatedData.content,
        createdAt: updatedData.createdAt,
        updatedAt: updatedData.updatedAt,
        deletedAt: updatedData.deletedAt ?? undefined,
      });

      this.logger.log('Comentário interno atualizado com sucesso', { id });
      return comment;

    } catch (error) {
      this.logger.error('Erro ao atualizar comentário interno', error instanceof Error ? error.message : 'Erro desconhecido', {
        id,
      });
      throw error;
    }
  }

  /**
   * Remove logicamente um comentário interno
   */
  async delete(id: string): Promise<boolean> {
    try {
      this.logger.log('Removendo comentário interno logicamente', { id });

      const result = await this.prisma.internalComment.updateMany({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      const deleted = result.count > 0;

      this.logger.log('Comentário interno removido logicamente', {
        id,
        deleted,
      });

      return deleted;

    } catch (error) {
      this.logger.error('Erro ao remover comentário interno logicamente', error instanceof Error ? error.message : 'Erro desconhecido', {
        id,
      });
      throw error;
    }
  }
}

/**
 * Factory function para criar instância do repositório
 * Mantém a pureza das camadas superiores ao não usar decorators
 */
export function createInternalCommentPrismaRepository(
  prisma: PrismaClient,
  logger: LoggerContract
): InternalCommentRepositoryContract {
  return new InternalCommentPrismaRepository(prisma, logger);
}

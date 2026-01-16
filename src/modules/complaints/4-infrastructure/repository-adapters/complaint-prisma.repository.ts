import { ComplaintRepositoryContract, ComplaintFilters, ComplaintPaginationParams, PaginatedComplaintsResult, ComplaintWithAuthor, ComplaintAuthorData } from '../../1-domain/contracts/complaint.repository.contract';
import { Complaint } from '../../1-domain/entities/complaint.entity';
import { ComplaintStatusHistory } from '../../1-domain/entities/complaint-status-history.entity';
import { ComplaintCategory } from '../../1-domain/value-objects/complaint-category.value-object';
import { ComplaintUrgency } from '../../1-domain/value-objects/complaint-urgency.value-object';
import { ComplaintStatus } from '../../1-domain/value-objects/complaint-status.value-object';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';

/**
 * Implementação do repositório de reclamações usando Prisma
 * Converte entre entidades de domínio e modelos do banco de dados
 */
export class ComplaintPrismaRepository implements ComplaintRepositoryContract {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerContract,
  ) {}

  async save(complaint: Complaint): Promise<void> {
    try {
      const data = {
        id: complaint.id,
        authorId: complaint.authorId,
        category: complaint.category.getValue() as any,
        description: complaint.description,
        urgency: complaint.urgency.getValue() as any,
        status: complaint.status.getValue() as any,
        isAnonymous: complaint.isAnonymous,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        deletedAt: complaint.deletedAt,
      };

      await this.prisma.complaint.upsert({
        where: { id: complaint.id },
        update: data,
        create: data,
      });

      this.logger.log('Reclamação salva com sucesso', { complaintId: complaint.id });
    } catch (error) {
      this.logger.error('Erro ao salvar reclamação', (error as Error).stack, {
        complaintId: complaint.id
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Complaint | null> {
    try {
      const complaintModel = await this.prisma.complaint.findUnique({
        where: { id },
      });

      if (!complaintModel) return null;
      if (complaintModel.deletedAt) return null;

      return this.mapToEntity(complaintModel);
    } catch (error) {
      this.logger.error('Erro ao buscar reclamação por ID', (error as Error).stack, { id });
      throw error;
    }
  }

  async findByAuthorId(authorId: string, includeDeleted: boolean = false): Promise<Complaint[]> {
    try {
      const where = includeDeleted
        ? { authorId }
        : { authorId, deletedAt: null };

      const complaintModels = await this.prisma.complaint.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return complaintModels.map(model => this.mapToEntity(model));
    } catch (error) {
      this.logger.error('Erro ao buscar reclamações por autor', (error as Error).stack, { authorId });
      throw error;
    }
  }

  async findByCategory(category: ComplaintCategory, includeDeleted: boolean = false): Promise<Complaint[]> {
    try {
      const where = includeDeleted
        ? { category: category.getValue() as any }
        : { category: category.getValue() as any, deletedAt: null };

      const complaintModels = await this.prisma.complaint.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return complaintModels.map(model => this.mapToEntity(model));
    } catch (error) {
      this.logger.error('Erro ao buscar reclamações por categoria', (error as Error).stack, {
        category: category.getValue()
      });
      throw error;
    }
  }

  async findByUrgency(urgency: ComplaintUrgency, includeDeleted: boolean = false): Promise<Complaint[]> {
    try {
      const where = includeDeleted
        ? { urgency: urgency.getValue() as any }
        : { urgency: urgency.getValue() as any, deletedAt: null };

      const complaintModels = await this.prisma.complaint.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return complaintModels.map(model => this.mapToEntity(model));
    } catch (error) {
      this.logger.error('Erro ao buscar reclamações por urgência', (error as Error).stack, {
        urgency: urgency.getValue()
      });
      throw error;
    }
  }

  async findByStatus(status: ComplaintStatus, includeDeleted: boolean = false): Promise<Complaint[]> {
    try {
      const where = includeDeleted
        ? { status: status.getValue() as any }
        : { status: status.getValue() as any, deletedAt: null };

      const complaintModels = await this.prisma.complaint.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return complaintModels.map(model => this.mapToEntity(model));
    } catch (error) {
      this.logger.error('Erro ao buscar reclamações por status', (error as Error).stack, {
        status: status.getValue()
      });
      throw error;
    }
  }

  async findAll(includeDeleted: boolean = false): Promise<Complaint[]> {
    try {
      const where = includeDeleted ? {} : { deletedAt: null };

      const complaintModels = await this.prisma.complaint.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return complaintModels.map(model => this.mapToEntity(model));
    } catch (error) {
      this.logger.error('Erro ao buscar todas as reclamações', (error as Error).stack);
      throw error;
    }
  }

  async countByAuthorInPeriod(authorId: string, since: Date): Promise<number> {
    try {
      return await this.prisma.complaint.count({
        where: {
          authorId,
          createdAt: {
            gte: since
          },
          deletedAt: null // Não conta reclamações deletadas
        }
      });
    } catch (error) {
      this.logger.error('Erro ao contar reclamações por autor no período', (error as Error).stack, {
        authorId,
        since: since.toISOString()
      });
      throw error;
    }
  }

  async findWithFilters(
    filters: ComplaintFilters,
    pagination: ComplaintPaginationParams,
    includeDeleted: boolean = false
  ): Promise<PaginatedComplaintsResult> {
    try {
      // Constrói a cláusula WHERE baseada nos filtros
      const where: any = {};

      // Não incluir deletados por padrão, a menos que especificado
      if (!includeDeleted) {
        where.deletedAt = null;
      }

      // Aplica filtros
      if (filters.status) {
        where.status = filters.status.getValue();
      }
      if (filters.category) {
        where.category = filters.category.getValue();
      }
      if (filters.urgency) {
        where.urgency = filters.urgency.getValue();
      }
      if (filters.authorId) {
        where.authorId = filters.authorId;
      }
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) {
          where.createdAt.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          where.createdAt.lte = filters.dateTo;
        }
      }

      this.logger.log('Executando query findWithFilters', {
        where,
        pagination,
        includeDeleted
      });

      // Conta total de registros
      const total = await this.prisma.complaint.count({ where });

      // Calcula paginação
      const skip = (pagination.page - 1) * pagination.limit;
      const totalPages = Math.ceil(total / pagination.limit);

      // Executa query paginada com join otimizado para dados do autor
      const complaintModels = await this.prisma.complaint.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              block: true,
              apartment: true
            }
          }
        }
      });

      // Processa os dados do join e cria o resultado otimizado
      const complaints: ComplaintWithAuthor[] = complaintModels.map(model => {
        const complaint = this.mapToEntity(model);

        // Dados do autor vindos do join
        let authorData: ComplaintAuthorData | null = null;
        if (model.author) {
          authorData = {
            id: model.author.id,
            name: model.author.name,
            block: model.author.block || undefined,
            apartment: model.author.apartment || undefined
          };
        }

        return {
          complaint,
          author: authorData
        };
      });

      return {
        complaints,
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages
      };
    } catch (error) {
      this.logger.error('Erro ao buscar reclamações com filtros', (error as Error).stack, {
        filters,
        pagination,
        includeDeleted
      });
      throw error;
    }
  }

  /**
   * Converte modelo do Prisma para entidade de domínio
   * @param model - Modelo do banco de dados
   * @returns Entidade Complaint
   */
  private mapToEntity(model: any): Complaint {
    const category = ComplaintCategory.fromPrimitives(model.category);
    const urgency = ComplaintUrgency.fromPrimitives(model.urgency);
    const status = ComplaintStatus.fromPrimitives(model.status);

    return Complaint.inflate(
      model.id,
      model.authorId,
      category,
      model.description,
      urgency,
      status,
      model.isAnonymous,
      model.createdAt,
      model.updatedAt,
      model.deletedAt
    );
  }

  async updateStatus(
    id: string,
    newStatus: ComplaintStatus,
    changedBy: string,
    reason?: string
  ): Promise<Complaint | null> {
    try {
      this.logger.log('Atualizando status da reclamação', {
        complaintId: id,
        newStatus: newStatus.getValue(),
        changedBy
      });

      // Busca a reclamação atual para obter o status anterior
      const currentComplaint = await this.prisma.complaint.findUnique({
        where: { id },
      });

      if (!currentComplaint) {
        return null;
      }

      // Executa a atualização e criação do histórico em uma transação
      const result = await this.prisma.$transaction(async (tx) => {
        // Atualiza o status da reclamação
        const updatedModel = await tx.complaint.update({
          where: { id },
          data: {
            status: newStatus.getValue() as any,
            updatedAt: new Date(),
          },
        });

        // Cria entrada no histórico
        await tx.complaintStatusHistory.create({
          data: {
            id: crypto.randomUUID(),
            complaintId: id,
            previousStatus: currentComplaint.status as any,
            newStatus: newStatus.getValue() as any,
            changedBy,
            reason,
          },
        });

        return updatedModel;
      });

      // Converte o modelo atualizado para entidade
      const updatedComplaint = this.mapToEntity(result);

      this.logger.log('Status da reclamação atualizado com sucesso', {
        complaintId: id,
        previousStatus: currentComplaint.status,
        newStatus: newStatus.getValue(),
        changedBy
      });

      return updatedComplaint;
    } catch (error) {
      this.logger.error('Erro ao atualizar status da reclamação', (error as Error).stack, {
        complaintId: id,
        newStatus: newStatus.getValue(),
        changedBy
      });
      throw error;
    }
  }

  async findStatusHistory(complaintId: string): Promise<ComplaintStatusHistory[]> {
    try {
      this.logger.log('Buscando histórico de status da reclamação', { complaintId });

      const historyModels = await this.prisma.complaintStatusHistory.findMany({
        where: { complaintId },
        orderBy: { changedAt: 'desc' },
      });

      const history = historyModels.map(model =>
        ComplaintStatusHistory.fromPrimitives({
          id: model.id,
          complaintId: model.complaintId,
          previousStatus: model.previousStatus,
          newStatus: model.newStatus,
          changedBy: model.changedBy,
          changedAt: model.changedAt,
          reason: model.reason || undefined,
        })
      );

      this.logger.log('Histórico de status encontrado', {
        complaintId,
        historyCount: history.length
      });

      return history;
    } catch (error) {
      this.logger.error('Erro ao buscar histórico de status', (error as Error).stack, {
        complaintId
      });
      throw error;
    }
  }
}

import { PrismaClient } from '@prisma/client';
import { AuditLog, AuditAction } from '../../1-domain/entities/audit-log.entity';
import { AuditRepositoryContract } from '../../1-domain/contracts/audit.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';

/**
 * Implementação do repositório de auditoria usando Prisma
 * Criado via factory function para manter pureza das camadas superiores
 */
export class AuditPrismaRepository implements AuditRepositoryContract {
  /**
   * Construtor com injeção de dependências
   */
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: LoggerContract
  ) {}

  /**
   * Salva um log de auditoria no banco de dados
   */
  async save(log: AuditLog): Promise<void> {
    try {
      this.logger.log('Salvando log de auditoria no banco de dados', {
        logId: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        performedBy: log.performedBy,
      });

      const primitives = log.toPrimitives();

      await this.prisma.auditLog.create({
        data: {
          id: primitives.id,
          action: primitives.action,
          entityType: primitives.entityType,
          entityId: primitives.entityId,
          performedBy: primitives.performedBy,
          details: primitives.details,
          ipAddress: primitives.ipAddress,
          userAgent: primitives.userAgent,
          createdAt: primitives.createdAt,
        },
      });

      this.logger.log('Log de auditoria salvo com sucesso', {
        logId: log.id,
      });

    } catch (error) {
      this.logger.error('Erro ao salvar log de auditoria', error instanceof Error ? error.message : 'Erro desconhecido', {
        logId: log.id,
      });
      throw error;
    }
  }

  /**
   * Busca um log de auditoria pelo ID
   */
  async findById(id: string): Promise<AuditLog | null> {
    try {
      this.logger.log('Buscando log de auditoria por ID', { id });

      const logData = await this.prisma.auditLog.findUnique({
        where: { id },
      });

      if (!logData) {
        this.logger.log('Log de auditoria não encontrado', { id });
        return null;
      }

      const log = AuditLog.fromPrimitives({
        id: logData.id,
        action: logData.action as AuditAction,
        entityType: logData.entityType,
        entityId: logData.entityId,
        performedBy: logData.performedBy,
        details: logData.details as any,
        ipAddress: logData.ipAddress ?? undefined,
        userAgent: logData.userAgent ?? undefined,
        createdAt: logData.createdAt,
      });

      this.logger.log('Log de auditoria encontrado', { id });
      return log;

    } catch (error) {
      this.logger.error('Erro ao buscar log de auditoria por ID', error instanceof Error ? error.message : 'Erro desconhecido', {
        id,
      });
      throw error;
    }
  }

  /**
   * Busca logs por ação
   */
  async findByAction(action: AuditAction): Promise<AuditLog[]> {
    try {
      this.logger.log('Buscando logs de auditoria por ação', { action });

      const logsData = await this.prisma.auditLog.findMany({
        where: { action },
        orderBy: { createdAt: 'desc' },
      });

      const logs = logsData.map(data =>
        AuditLog.fromPrimitives({
          id: data.id,
          action: data.action as AuditAction,
          entityType: data.entityType,
          entityId: data.entityId,
          performedBy: data.performedBy,
          details: data.details as any,
          ipAddress: data.ipAddress ?? undefined,
          userAgent: data.userAgent ?? undefined,
          createdAt: data.createdAt,
        })
      );

      this.logger.log('Logs de auditoria encontrados por ação', {
        action,
        count: logs.length,
      });

      return logs;

    } catch (error) {
      this.logger.error('Erro ao buscar logs de auditoria por ação', error instanceof Error ? error.message : 'Erro desconhecido', {
        action,
      });
      throw error;
    }
  }

  /**
   * Busca logs por tipo de entidade
   */
  async findByEntityType(entityType: string): Promise<AuditLog[]> {
    try {
      this.logger.log('Buscando logs de auditoria por tipo de entidade', { entityType });

      const logsData = await this.prisma.auditLog.findMany({
        where: { entityType },
        orderBy: { createdAt: 'desc' },
      });

      const logs = logsData.map(data =>
        AuditLog.fromPrimitives({
          id: data.id,
          action: data.action as AuditAction,
          entityType: data.entityType,
          entityId: data.entityId,
          performedBy: data.performedBy,
          details: data.details as any,
          ipAddress: data.ipAddress ?? undefined,
          userAgent: data.userAgent ?? undefined,
          createdAt: data.createdAt,
        })
      );

      this.logger.log('Logs de auditoria encontrados por tipo de entidade', {
        entityType,
        count: logs.length,
      });

      return logs;

    } catch (error) {
      this.logger.error('Erro ao buscar logs de auditoria por tipo de entidade', error instanceof Error ? error.message : 'Erro desconhecido', {
        entityType,
      });
      throw error;
    }
  }

  /**
   * Busca logs por ID da entidade
   */
  async findByEntityId(entityId: string): Promise<AuditLog[]> {
    try {
      this.logger.log('Buscando logs de auditoria por ID da entidade', { entityId });

      const logsData = await this.prisma.auditLog.findMany({
        where: { entityId },
        orderBy: { createdAt: 'desc' },
      });

      const logs = logsData.map(data =>
        AuditLog.fromPrimitives({
          id: data.id,
          action: data.action as AuditAction,
          entityType: data.entityType,
          entityId: data.entityId,
          performedBy: data.performedBy,
          details: data.details as any,
          ipAddress: data.ipAddress ?? undefined,
          userAgent: data.userAgent ?? undefined,
          createdAt: data.createdAt,
        })
      );

      this.logger.log('Logs de auditoria encontrados por ID da entidade', {
        entityId,
        count: logs.length,
      });

      return logs;

    } catch (error) {
      this.logger.error('Erro ao buscar logs de auditoria por ID da entidade', error instanceof Error ? error.message : 'Erro desconhecido', {
        entityId,
      });
      throw error;
    }
  }

  /**
   * Busca logs por usuário que executou a ação
   */
  async findByPerformedBy(performedBy: string): Promise<AuditLog[]> {
    try {
      this.logger.log('Buscando logs de auditoria por usuário', { performedBy });

      const logsData = await this.prisma.auditLog.findMany({
        where: { performedBy },
        orderBy: { createdAt: 'desc' },
      });

      const logs = logsData.map(data =>
        AuditLog.fromPrimitives({
          id: data.id,
          action: data.action as AuditAction,
          entityType: data.entityType,
          entityId: data.entityId,
          performedBy: data.performedBy,
          details: data.details as any,
          ipAddress: data.ipAddress ?? undefined,
          userAgent: data.userAgent ?? undefined,
          createdAt: data.createdAt,
        })
      );

      this.logger.log('Logs de auditoria encontrados por usuário', {
        performedBy,
        count: logs.length,
      });

      return logs;

    } catch (error) {
      this.logger.error('Erro ao buscar logs de auditoria por usuário', error instanceof Error ? error.message : 'Erro desconhecido', {
        performedBy,
      });
      throw error;
    }
  }

  /**
   * Busca logs com filtros e paginação
   */
  async findWithFilters(filters: any, pagination: any): Promise<any> {
    try {
      this.logger.log('Buscando logs de auditoria com filtros', {
        filters,
        pagination,
      });

      const whereClause: any = {};
      if (filters.action) whereClause.action = filters.action;
      if (filters.entityType) whereClause.entityType = filters.entityType;
      if (filters.entityId) whereClause.entityId = filters.entityId;
      if (filters.performedBy) whereClause.performedBy = filters.performedBy;
      if (filters.ipAddress) whereClause.ipAddress = filters.ipAddress;
      if (filters.dateFrom || filters.dateTo) {
        whereClause.createdAt = {};
        if (filters.dateFrom) whereClause.createdAt.gte = filters.dateFrom;
        if (filters.dateTo) whereClause.createdAt.lte = filters.dateTo;
      }

      const [logsData, total] = await Promise.all([
        this.prisma.auditLog.findMany({
          where: whereClause,
          include: {
            user: {
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
        this.prisma.auditLog.count({ where: whereClause }),
      ]);

      const logs = logsData.map(data => ({
        log: AuditLog.fromPrimitives({
          id: data.id,
          action: data.action as AuditAction,
          entityType: data.entityType,
          entityId: data.entityId,
          performedBy: data.performedBy,
          details: data.details as any,
          ipAddress: data.ipAddress ?? undefined,
          userAgent: data.userAgent ?? undefined,
          createdAt: data.createdAt,
        }),
        user: {
          id: data.user.id,
          name: data.user.name,
          role: data.user.role,
        },
      }));

      const totalPages = Math.ceil(total / pagination.limit);

      this.logger.log('Logs de auditoria encontrados com filtros', {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
      });

      return {
        logs,
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
      };

    } catch (error) {
      this.logger.error('Erro ao buscar logs de auditoria com filtros', error instanceof Error ? error.message : 'Erro desconhecido', {
        filters,
        pagination,
      });
      throw error;
    }
  }

  /**
   * Conta o número de logs por entidade
   */
  async countByEntityId(entityId: string): Promise<number> {
    try {
      const count = await this.prisma.auditLog.count({ where: { entityId } });

      this.logger.log('Contagem de logs de auditoria por entidade', {
        entityId,
        count,
      });

      return count;

    } catch (error) {
      this.logger.error('Erro ao contar logs de auditoria por entidade', error instanceof Error ? error.message : 'Erro desconhecido', {
        entityId,
      });
      throw error;
    }
  }

  /**
   * Busca logs recentes (últimas 24 horas)
   */
  async findRecent(limit: number = 50): Promise<AuditLog[]> {
    try {
      this.logger.log('Buscando logs de auditoria recentes', { limit });

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const logsData = await this.prisma.auditLog.findMany({
        where: {
          createdAt: {
            gte: yesterday,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      const logs = logsData.map(data =>
        AuditLog.fromPrimitives({
          id: data.id,
          action: data.action as AuditAction,
          entityType: data.entityType,
          entityId: data.entityId,
          performedBy: data.performedBy,
          details: data.details as any,
          ipAddress: data.ipAddress ?? undefined,
          userAgent: data.userAgent ?? undefined,
          createdAt: data.createdAt,
        })
      );

      this.logger.log('Logs de auditoria recentes encontrados', {
        count: logs.length,
        limit,
      });

      return logs;

    } catch (error) {
      this.logger.error('Erro ao buscar logs de auditoria recentes', error instanceof Error ? error.message : 'Erro desconhecido', {
        limit,
      });
      throw error;
    }
  }

  /**
   * Limpa logs antigos (mais de X dias)
   */
  async cleanup(daysOld: number): Promise<number> {
    try {
      this.logger.log('Limpando logs de auditoria antigos', { daysOld });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.auditLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log('Logs de auditoria antigos removidos', {
        daysOld,
        deletedCount: result.count,
      });

      return result.count;

    } catch (error) {
      this.logger.error('Erro ao limpar logs de auditoria antigos', error instanceof Error ? error.message : 'Erro desconhecido', {
        daysOld,
      });
      throw error;
    }
  }
}

/**
 * Factory function para criar instância do repositório
 * Mantém a pureza das camadas superiores ao não usar decorators
 */
export function createAuditPrismaRepository(
  prisma: PrismaClient,
  logger: LoggerContract
): AuditRepositoryContract {
  return new AuditPrismaRepository(prisma, logger);
}

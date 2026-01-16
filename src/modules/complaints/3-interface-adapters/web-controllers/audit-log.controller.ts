import {
  Controller,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Roles } from '../../../auth/3-interface-adapters/decorators/roles.decorator';
import { UserRole } from '../../../auth/1-domain/entities/auth-user.entity';
import { RolesGuard } from '../../../auth/3-interface-adapters/guards/roles.guard';
import { JwtAuthGuard } from '../../../auth/3-interface-adapters/guards/jwt-auth.guard';
import { COMPLAINTS_TOKENS } from '../../4-infrastructure/di/complaints.tokens';

import { ListAuditLogsUseCase } from '../../2-application/use-cases/list-audit-logs.usecase';

import { ListAuditLogsResponseDto } from '../api-dto/audit-log-response.dto';
import { ListAuditLogsQueryDto } from '../api-dto/list-audit-logs-query.dto';

import { Result } from '../../../users/1-domain/value-objects/result.value-object';

/**
 * Controller para consulta de logs de auditoria
 * Apenas usuários com papel Admin podem acessar estes endpoints
 */
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AuditLogController {
  constructor(
    @Inject(COMPLAINTS_TOKENS.LIST_AUDIT_LOGS_USECASE)
    private readonly listAuditLogsUseCase: ListAuditLogsUseCase,
  ) {}

  /**
   * Lista logs de auditoria com filtros e paginação
   * GET /admin/audit-logs
   * Apenas Admin pode acessar
   */
  @Get()
  async listAuditLogs(
    @Query() query: ListAuditLogsQueryDto,
  ): Promise<ListAuditLogsResponseDto> {
    try {
      // Converte as datas string para Date objects se fornecidas
      const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
      const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;

      // Executa o caso de uso
      const result = await this.listAuditLogsUseCase.execute({
        action: query.action,
        entityType: query.entityType,
        entityId: query.entityId,
        performedBy: query.performedBy,
        dateFrom,
        dateTo,
        page: query.page,
        limit: query.limit,
      });

      if (result.isFailure) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: result.error,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Converte a resposta do domínio para o formato da API
      const response: ListAuditLogsResponseDto = {
        logs: (result as any).value.logs,
        total: (result as any).value.total,
        page: (result as any).value.page,
        limit: (result as any).value.limit,
        totalPages: (result as any).value.totalPages,
      };

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro interno ao listar logs de auditoria',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lista logs recentes (últimas 24 horas)
   * GET /admin/audit-logs/recent
   * Apenas Admin pode acessar
   */
  @Get('recent')
  async listRecentAuditLogs(): Promise<ListAuditLogsResponseDto> {
    try {
      // Executa o caso de uso sem filtros para buscar logs recentes
      const result = await this.listAuditLogsUseCase.execute({
        dateFrom: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 horas atrás
        dateTo: new Date(),
        page: 1,
        limit: 50, // Máximo 50 logs recentes
      });

      if (result.isFailure) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: result.error,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Converte a resposta do domínio para o formato da API
      const response: ListAuditLogsResponseDto = {
        logs: (result as any).value.logs,
        total: (result as any).value.total,
        page: (result as any).value.page,
        limit: (result as any).value.limit,
        totalPages: (result as any).value.totalPages,
      };

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro interno ao listar logs recentes',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Inject,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Roles } from '../../../auth/3-interface-adapters/decorators/roles.decorator';
import { UserRole } from '../../../auth/1-domain/entities/auth-user.entity';
import { RolesGuard } from '../../../auth/3-interface-adapters/guards/roles.guard';
import { JwtAuthGuard } from '../../../auth/3-interface-adapters/guards/jwt-auth.guard';
import { COMPLAINTS_TOKENS } from '../../4-infrastructure/di/complaints.tokens';

import { AddInternalCommentUseCase } from '../../2-application/use-cases/add-internal-comment.usecase';
import { ListInternalCommentsUseCase } from '../../2-application/use-cases/list-internal-comments.usecase';

import { AddInternalCommentRequestDto } from '../api-dto/add-internal-comment-request.dto';
import {
  ListInternalCommentsResponseDto,
  InternalCommentWithAuthorResponseDto,
} from '../api-dto/internal-comment-response.dto';
import { ListInternalCommentsQueryDto } from '../api-dto/list-internal-comments-query.dto';

import { Result } from '../../../users/1-domain/value-objects/result.value-object';

/**
 * Controller para gerenciamento de comentários internos em reclamações
 * Apenas usuários com papel Admin ou Sindico podem acessar estes endpoints
 */
@Controller('complaints/internal-comments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SINDICO)
export class InternalCommentController {
  constructor(
    @Inject(COMPLAINTS_TOKENS.ADD_INTERNAL_COMMENT_USECASE)
    private readonly addInternalCommentUseCase: AddInternalCommentUseCase,

    @Inject(COMPLAINTS_TOKENS.LIST_INTERNAL_COMMENTS_USECASE)
    private readonly listInternalCommentsUseCase: ListInternalCommentsUseCase,
  ) {}

  /**
   * Adiciona um comentário interno a uma reclamação
   * POST /complaints/internal-comments
   */
  @Post()
  async addInternalComment(
    @Body() dto: AddInternalCommentRequestDto,
    @Request() req: any,
  ): Promise<{ message: string; comment: InternalCommentWithAuthorResponseDto }> {
    try {
      // Executa o caso de uso
      const result = await this.addInternalCommentUseCase.execute({
        complaintId: dto.complaintId,
        authorId: req.user.id, // ID do usuário autenticado
        content: dto.content,
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
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
      const response: InternalCommentWithAuthorResponseDto = {
        comment: {
          id: (result as any).value.comment.id,
          complaintId: (result as any).value.comment.complaintId,
          authorId: (result as any).value.comment.authorId,
          content: (result as any).value.comment.content,
          createdAt: (result as any).value.comment.createdAt,
          updatedAt: (result as any).value.comment.updatedAt,
          deletedAt: (result as any).value.comment.deletedAt,
        },
        author: {
          id: req.user.id,
          name: req.user.name,
          role: req.user.role,
        },
      };

      return {
        message: 'Comentário interno adicionado com sucesso',
        comment: response,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro interno ao adicionar comentário',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lista comentários internos com filtros e paginação
   * GET /complaints/internal-comments
   */
  @Get()
  async listInternalComments(
    @Query() query: ListInternalCommentsQueryDto,
  ): Promise<ListInternalCommentsResponseDto> {
    try {
      // Executa o caso de uso
      const result = await this.listInternalCommentsUseCase.execute({
        complaintId: query.complaintId,
        authorId: query.authorId,
        page: query.page,
        limit: query.limit,
        includeDeleted: query.includeDeleted,
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
      const response: ListInternalCommentsResponseDto = {
        comments: (result as any).value.comments,
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
          message: 'Erro interno ao listar comentários',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lista comentários internos de uma reclamação específica
   * GET /complaints/:complaintId/internal-comments
   */
  @Get('complaint/:complaintId')
  async listCommentsByComplaint(
    @Param('complaintId') complaintId: string,
    @Query() query: Omit<ListInternalCommentsQueryDto, 'complaintId'>,
  ): Promise<ListInternalCommentsResponseDto> {
    try {
      // Executa o caso de uso filtrando pela reclamação
      const result = await this.listInternalCommentsUseCase.execute({
        complaintId,
        page: query.page,
        limit: query.limit,
        includeDeleted: query.includeDeleted,
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
      const response: ListInternalCommentsResponseDto = {
        comments: (result as any).value.comments,
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
          message: 'Erro interno ao listar comentários da reclamação',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

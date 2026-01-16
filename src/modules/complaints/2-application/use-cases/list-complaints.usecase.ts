import type { ComplaintRepositoryContract, ComplaintFilters, ComplaintPaginationParams, PaginatedComplaintsResult, ComplaintAuthorData } from '../../1-domain/contracts/complaint.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { Complaint } from '../../1-domain/entities/complaint.entity';
import { ComplaintMapper } from '../dto/complaint.mapper';
import {
  ComplaintFullOutputDto,
  ComplaintLimitedOutputDto
} from '../dto/complaint.dto';
import { Result } from '../../1-domain';

/**
 * Dados necessários para executar o caso de uso
 */
export interface ListComplaintsDto {
  userId: string;
  userRole: string; // 'ADMIN', 'SINDICO', 'MORADOR'
  pagination?: ComplaintPaginationParams;
  filters?: ComplaintFilters;
  includeDeleted?: boolean;
}

/**
 * Resultado do caso de uso com DTOs apropriados por role
 */
export interface ListComplaintsResult {
  complaints: ComplaintFullOutputDto[] | ComplaintLimitedOutputDto[];
  viewType: 'full' | 'limited';
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Caso de uso para listar reclamações
 * Implementa lógica de anonimato baseada nas permissões do usuário
 */
export class ListComplaintsUseCase {
  constructor(
    private readonly complaintRepository: ComplaintRepositoryContract,
    private readonly logger: LoggerContract,
  ) { }

  async execute(dto: ListComplaintsDto): Promise<Result<ListComplaintsResult>> {
    try {
      this.logger.log('Executando ListComplaintsUseCase', {
        userId: dto.userId,
        userRole: dto.userRole,
        pagination: dto.pagination,
        filters: dto.filters,
        includeDeleted: dto.includeDeleted
      });

      // Configura paginação padrão se não fornecida
      const pagination: ComplaintPaginationParams = dto.pagination || {
        page: 1,
        limit: 10
      };

      // Configura filtros baseados na role do usuário
      const filters: ComplaintFilters = { ...dto.filters };

      // Para moradores, limita apenas às suas próprias reclamações
      const isAdminOrSindico = ['ADMIN', 'SINDICO'].includes(dto.userRole);
      if (!isAdminOrSindico) {
        filters.authorId = dto.userId;
      }

      // Determina o tipo de visualização baseado na role do usuário
      const viewType = isAdminOrSindico ? 'full' : 'limited';

      // Busca reclamações com filtros e paginação
      const result = await this.complaintRepository.findWithFilters(
        filters,
        pagination,
        dto.includeDeleted
      );

      if (isAdminOrSindico) {
        // Admin/Síndico: visão completa com dados do autor
        const fullComplaints: ComplaintFullOutputDto[] = [];

        for (const { complaint, author } of result.complaints) {
          // Usa dados do autor vindos da query otimizada
          const authorName = author?.name || 'Usuário não encontrado';
          const authorBlock = author?.block || '';
          const authorApartment = author?.apartment || '';

          fullComplaints.push(ComplaintMapper.toFullDto(
            complaint,
            authorName,
            authorBlock,
            authorApartment
          ));
        }

        return Result.ok({
          complaints: fullComplaints,
          viewType,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages
          }
        });
      } else {
        // Morador: visão limitada, dados do autor ocultos se anônimo
        const limitedComplaints: ComplaintLimitedOutputDto[] = [];

        for (const { complaint, author } of result.complaints) {
          // Para moradores:
          // 1. Se for o próprio autor, mostra o nome (e indica que é dele)
          // 2. Se for de outro autor e for anônima, oculta o nome
          // 3. Se for de outro autor e não for anônima, mostra o nome
          let authorName: string | undefined;

          const isAuthor = complaint.authorId === dto.userId;

          if (isAuthor) {
            authorName = `${author?.name || 'Eu'} (Você)`;
          } else if (!complaint.isAnonymous && author) {
            authorName = author.name;
          }

          limitedComplaints.push(ComplaintMapper.toLimitedDto(complaint, authorName));
        }

        return Result.ok({
          complaints: limitedComplaints,
          viewType,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages
          }
        });
      }

    } catch (error) {
      this.logger.error('Erro ao listar reclamações', (error as Error).stack, {
        userId: dto.userId,
        userRole: dto.userRole
      });
      return Result.fail('Erro inesperado ao listar reclamações');
    }
  }
}

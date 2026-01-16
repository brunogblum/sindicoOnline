import { IsOptional, IsInt, Min, Max, IsDateString, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * DTO para query parameters da listagem de reclamações
 * Suporta paginação e filtros
 */
export class ListComplaintsQueryDto {
  /**
   * Página atual (começando em 1)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Número de itens por página
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  /**
   * Filtrar por status da reclamação
   */
  @IsOptional()
  @IsString()
  status?: string;

  /**
   * Filtrar por categoria da reclamação
   */
  @IsOptional()
  @IsString()
  category?: string;

  /**
   * Filtrar por urgência da reclamação
   */
  @IsOptional()
  @IsString()
  urgency?: string;

  /**
   * Data inicial do filtro (formato ISO 8601)
   */
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  /**
   * Data final do filtro (formato ISO 8601)
   */
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  /**
   * Incluir reclamações deletadas (apenas para admin/síndico)
   */
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDeleted?: boolean = false;
}





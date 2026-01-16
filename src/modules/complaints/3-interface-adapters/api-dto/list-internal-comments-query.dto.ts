import { IsOptional, IsUUID, IsInt, Min, Max, IsBooleanString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * DTO para query parameters de listagem de comentários internos
 */
export class ListInternalCommentsQueryDto {
  /**
   * ID da reclamação (opcional - filtra comentários de uma reclamação específica)
   */
  @IsOptional()
  @IsUUID('4', { message: 'ID da reclamação deve ser um UUID válido' })
  complaintId?: string;

  /**
   * ID do autor (opcional - filtra comentários de um autor específico)
   */
  @IsOptional()
  @IsUUID('4', { message: 'ID do autor deve ser um UUID válido' })
  authorId?: string;

  /**
   * Página da listagem (padrão: 1)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser maior ou igual a 1' })
  page?: number = 1;

  /**
   * Número de itens por página (padrão: 10, máximo: 50)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite deve ser maior ou igual a 1' })
  @Max(50, { message: 'Limite não pode exceder 50' })
  limit?: number = 10;

  /**
   * Incluir comentários deletados (padrão: false)
   */
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBooleanString({ message: 'Incluir deletados deve ser um booleano' })
  includeDeleted?: boolean = false;
}





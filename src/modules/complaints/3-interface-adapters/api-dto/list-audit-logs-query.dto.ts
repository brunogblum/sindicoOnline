import { IsOptional, IsUUID, IsInt, Min, Max, IsDateString, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AuditAction } from '../../1-domain/entities/audit-log.entity';

/**
 * DTO para query parameters de listagem de logs de auditoria
 * Apenas usuários Admin podem acessar logs de auditoria
 */
export class ListAuditLogsQueryDto {
  /**
   * Ação a ser filtrada (opcional)
   */
  @IsOptional()
  @IsEnum(AuditAction, { message: 'Ação deve ser um valor válido de AuditAction' })
  action?: AuditAction;

  /**
   * Tipo da entidade (opcional)
   */
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  entityType?: string;

  /**
   * ID da entidade (opcional)
   */
  @IsOptional()
  @IsUUID('4', { message: 'ID da entidade deve ser um UUID válido' })
  entityId?: string;

  /**
   * ID do usuário que executou a ação (opcional)
   */
  @IsOptional()
  @IsUUID('4', { message: 'ID do usuário deve ser um UUID válido' })
  performedBy?: string;

  /**
   * Data inicial do filtro (formato ISO 8601)
   */
  @IsOptional()
  @IsDateString({}, { message: 'Data inicial deve estar no formato ISO 8601' })
  dateFrom?: string;

  /**
   * Data final do filtro (formato ISO 8601)
   */
  @IsOptional()
  @IsDateString({}, { message: 'Data final deve estar no formato ISO 8601' })
  dateTo?: string;

  /**
   * Página da listagem (padrão: 1)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser maior ou igual a 1' })
  page?: number = 1;

  /**
   * Número de itens por página (padrão: 20, máximo: 100)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite deve ser maior ou igual a 1' })
  @Max(100, { message: 'Limite não pode exceder 100' })
  limit?: number = 20;
}





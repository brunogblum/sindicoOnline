import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO para requisição de atualização de status da reclamação
 */
export class UpdateComplaintStatusRequestDto {
  /**
   * Novo status da reclamação
   */
  @IsString({ message: 'Status deve ser uma string' })
  @IsIn(['PENDENTE', 'EM_ANALISE', 'RESOLVIDA', 'REJEITADA'], {
    message: 'Status deve ser um dos valores permitidos: PENDENTE, EM_ANALISE, RESOLVIDA, REJEITADA'
  })
  newStatus!: string;

  /**
   * Motivo opcional da alteração de status
   */
  @IsOptional()
  @IsString({ message: 'Motivo deve ser uma string' })
  @MaxLength(500, { message: 'Motivo deve ter no máximo 500 caracteres' })
  reason?: string;
}





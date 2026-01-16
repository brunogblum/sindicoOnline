import { ComplaintStatus } from '../../1-domain/value-objects/complaint-status.value-object';

/**
 * DTO para resposta da atualização de status da reclamação
 */
export class UpdateComplaintStatusResponseDto {
  /**
   * ID da reclamação
   */
  complaintId!: string;

  /**
   * Status anterior da reclamação
   */
  previousStatus!: ComplaintStatus;

  /**
   * Novo status da reclamação
   */
  newStatus!: ComplaintStatus;

  /**
   * ID do usuário que fez a alteração
   */
  changedBy!: string;

  /**
   * Data e hora da alteração
   */
  changedAt!: Date;

  /**
   * Motivo opcional da alteração
   */
  reason?: string;
}





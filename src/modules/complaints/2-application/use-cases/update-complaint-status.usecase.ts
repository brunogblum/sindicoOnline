import { Result } from '../../../users/1-domain/value-objects/result.value-object';
import { ComplaintStatus } from '../../1-domain/value-objects/complaint-status.value-object';
import { ComplaintRepositoryContract } from '../../1-domain/contracts/complaint.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';

/**
 * Dados de entrada para atualização de status
 */
export interface UpdateComplaintStatusRequest {
  complaintId: string;
  newStatus: ComplaintStatus;
  changedBy: string;
  reason?: string;
}

/**
 * Dados de resposta da atualização de status
 */
export interface UpdateComplaintStatusResponse {
  complaintId: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

/**
 * Caso de uso para atualização do status de uma reclamação
 * Valida regras de negócio e registra histórico de mudanças
 */
export class UpdateComplaintStatusUseCase {
  constructor(
    private readonly complaintRepository: ComplaintRepositoryContract,
    private readonly logger: LoggerContract,
  ) {}

  /**
   * Executa a atualização do status da reclamação
   * @param request - Dados da solicitação de atualização
   * @returns Result com dados da atualização ou erro
   */
  async execute(
    request: UpdateComplaintStatusRequest,
  ): Promise<Result<UpdateComplaintStatusResponse>> {
    try {
      this.logger.log('Iniciando atualização de status da reclamação', {
        complaintId: request.complaintId,
        newStatus: request.newStatus.getValue(),
        changedBy: request.changedBy,
      });

      // Busca a reclamação atual
      const complaint = await this.complaintRepository.findById(request.complaintId);
      if (!complaint) {
        const error = 'Reclamação não encontrada';
        this.logger.warn(error, { complaintId: request.complaintId });
        return Result.fail(error);
      }

      // Valida se a transição é permitida
      const transitionResult = complaint.status.canTransitionTo(request.newStatus);
      if (transitionResult.isFailure) {
        this.logger.warn('Transição de status não permitida', {
          complaintId: request.complaintId,
          currentStatus: complaint.status.getValue(),
          requestedStatus: request.newStatus.getValue(),
          error: transitionResult.error,
        });
        return Result.fail(transitionResult.error);
      }

      // Atualiza o status da reclamação
      const updatedComplaint = await this.complaintRepository.updateStatus(
        request.complaintId,
        request.newStatus,
        request.changedBy,
        request.reason,
      );

      if (!updatedComplaint) {
        const error = 'Falha ao atualizar status da reclamação';
        this.logger.error(error, undefined, { complaintId: request.complaintId });
        return Result.fail(error);
      }

      const response: UpdateComplaintStatusResponse = {
        complaintId: request.complaintId,
        previousStatus: complaint.status,
        newStatus: request.newStatus,
        changedBy: request.changedBy,
        changedAt: new Date(),
        reason: request.reason,
      };

      this.logger.log('Status da reclamação atualizado com sucesso', {
        complaintId: request.complaintId,
        previousStatus: complaint.status.getValue(),
        newStatus: request.newStatus.getValue(),
        changedBy: request.changedBy,
      });

      return Result.ok(response);
    } catch (error) {
      const errorMessage = 'Erro interno ao atualizar status da reclamação';
      this.logger.error(errorMessage, error instanceof Error ? error.stack : undefined, {
        complaintId: request.complaintId,
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.fail(errorMessage);
    }
  }
}

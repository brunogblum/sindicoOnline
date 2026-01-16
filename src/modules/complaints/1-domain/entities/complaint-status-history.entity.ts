import { Result } from '../../../users/1-domain/value-objects/result.value-object';
import { ComplaintStatus } from '../value-objects/complaint-status.value-object';

/**
 * Entidade que representa uma entrada no histórico de mudanças de status
 * Registra quem mudou o status, quando e qual foi a transição
 */
export class ComplaintStatusHistory {
  private constructor(
    private readonly id: string,
    private readonly complaintId: string,
    private readonly previousStatus: ComplaintStatus,
    private readonly newStatus: ComplaintStatus,
    private readonly changedBy: string, // ID do usuário que fez a mudança
    private readonly changedAt: Date,
    private readonly reason?: string, // Motivo opcional da mudança
  ) {}

  /**
   * Cria uma nova entrada no histórico de status
   * @param params - Parâmetros para criação
   * @returns Result com a entidade ou erro
   */
  static create(params: {
    id: string;
    complaintId: string;
    previousStatus: ComplaintStatus;
    newStatus: ComplaintStatus;
    changedBy: string;
    reason?: string;
  }): Result<ComplaintStatusHistory> {
    if (!params.id || params.id.trim().length === 0) {
      return Result.fail('ID é obrigatório');
    }

    if (!params.complaintId || params.complaintId.trim().length === 0) {
      return Result.fail('ID da reclamação é obrigatório');
    }

    if (!params.changedBy || params.changedBy.trim().length === 0) {
      return Result.fail('ID do usuário que alterou é obrigatório');
    }

    if (params.previousStatus.equals(params.newStatus)) {
      return Result.fail('Status anterior e novo devem ser diferentes');
    }

    return Result.ok(
      new ComplaintStatusHistory(
        params.id,
        params.complaintId,
        params.previousStatus,
        params.newStatus,
        params.changedBy,
        new Date(),
        params.reason,
      ),
    );
  }

  /**
   * Cria uma instância a partir de dados primitivos (do banco de dados)
   * @param primitives - Dados primitivos
   * @returns Instância da entidade
   */
  static fromPrimitives(primitives: {
    id: string;
    complaintId: string;
    previousStatus: string;
    newStatus: string;
    changedBy: string;
    changedAt: Date;
    reason?: string;
  }): ComplaintStatusHistory {
    return new ComplaintStatusHistory(
      primitives.id,
      primitives.complaintId,
      ComplaintStatus.fromPrimitives(primitives.previousStatus),
      ComplaintStatus.fromPrimitives(primitives.newStatus),
      primitives.changedBy,
      primitives.changedAt,
      primitives.reason,
    );
  }

  // Getters públicos (propriedades readonly)
  getId(): string {
    return this.id;
  }

  getComplaintId(): string {
    return this.complaintId;
  }

  getPreviousStatus(): ComplaintStatus {
    return this.previousStatus;
  }

  getNewStatus(): ComplaintStatus {
    return this.newStatus;
  }

  getChangedBy(): string {
    return this.changedBy;
  }

  getChangedAt(): Date {
    return this.changedAt;
  }

  getReason(): string | undefined {
    return this.reason;
  }
}





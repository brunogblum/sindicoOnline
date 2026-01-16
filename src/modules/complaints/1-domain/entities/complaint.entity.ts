import { ComplaintCategory } from '../value-objects/complaint-category.value-object';
import { ComplaintUrgency } from '../value-objects/complaint-urgency.value-object';
import { ComplaintStatus } from '../value-objects/complaint-status.value-object';
import { Result } from '../../../users/1-domain/value-objects/result.value-object';

/**
 * Entidade de domínio que representa uma reclamação no sistema
 * Implementa imutabilidade através de propriedades readonly e factory methods
 */
export class Complaint {
  constructor(
    private readonly _id: string,
    private readonly _authorId: string,
    private readonly _category: ComplaintCategory,
    private readonly _description: string,
    private readonly _urgency: ComplaintUrgency,
    private readonly _status: ComplaintStatus,
    private readonly _isAnonymous: boolean,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _deletedAt?: Date | null,
  ) {}

  // Getters para acesso às propriedades
  get id(): string {
    return this._id;
  }

  get authorId(): string {
    return this._authorId;
  }

  get category(): ComplaintCategory {
    return this._category;
  }

  get description(): string {
    return this._description;
  }

  get urgency(): ComplaintUrgency {
    return this._urgency;
  }

  get status(): ComplaintStatus {
    return this._status;
  }

  get isAnonymous(): boolean {
    return this._isAnonymous;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this._deletedAt;
  }

  /**
   * Factory method para criar uma nova reclamação
   * Valida os dados de entrada antes de criar a entidade
   */
  static create(
    id: string,
    authorId: string,
    category: ComplaintCategory,
    description: string,
    urgency: ComplaintUrgency,
    isAnonymous: boolean = false,
  ): Result<Complaint> {
    // Validações de negócio
    if (!authorId || authorId.trim().length === 0) {
      return Result.fail('ID do autor é obrigatório');
    }

    if (!description || description.trim().length === 0) {
      return Result.fail('Descrição é obrigatória');
    }

    if (description.trim().length < 10) {
      return Result.fail('Descrição deve ter pelo menos 10 caracteres');
    }

    if (description.trim().length > 1000) {
      return Result.fail('Descrição deve ter no máximo 1000 caracteres');
    }

    const now = new Date();
    const defaultStatus = ComplaintStatus.default();

    return Result.ok(new Complaint(
      id,
      authorId,
      category,
      description.trim(),
      urgency,
      defaultStatus,
      isAnonymous,
      now,
      now,
      null
    ));
  }

  /**
   * Factory method para reconstruir uma reclamação a partir do banco de dados
   * Não faz validações pois assume que os dados já foram validados
   */
  static inflate(
    id: string,
    authorId: string,
    category: ComplaintCategory,
    description: string,
    urgency: ComplaintUrgency,
    status: ComplaintStatus,
    isAnonymous: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): Complaint {
    return new Complaint(
      id,
      authorId,
      category,
      description,
      urgency,
      status,
      isAnonymous,
      createdAt,
      updatedAt,
      deletedAt
    );
  }

  /**
   * Marca a reclamação como deletada (soft delete)
   * @returns Nova instância da reclamação com deletedAt definido
   */
  markAsDeleted(): Complaint {
    return new Complaint(
      this._id,
      this._authorId,
      this._category,
      this._description,
      this._urgency,
      this._status,
      this._isAnonymous,
      this._createdAt,
      new Date(), // atualiza updatedAt
      new Date() // define deletedAt
    );
  }

  /**
   * Atualiza o status da reclamação
   * @param newStatus - Novo status da reclamação
   * @returns Nova instância da reclamação com status atualizado
   */
  updateStatus(newStatus: ComplaintStatus): Complaint {
    return new Complaint(
      this._id,
      this._authorId,
      this._category,
      this._description,
      this._urgency,
      newStatus,
      this._isAnonymous,
      this._createdAt,
      new Date(), // atualiza updatedAt
      this._deletedAt
    );
  }

  /**
   * Verifica se a reclamação pode ser editada
   * @returns True se pode ser editada
   */
  canBeEdited(): boolean {
    return this._status.canBeEdited() && !this._deletedAt;
  }

  /**
   * Verifica se a reclamação está ativa
   * @returns True se estiver ativa
   */
  isActive(): boolean {
    return this._status.isActive() && !this._deletedAt;
  }

  /**
   * Verifica se a reclamação está concluída
   * @returns True se estiver concluída
   */
  isCompleted(): boolean {
    return this._status.isCompleted() && !this._deletedAt;
  }
}


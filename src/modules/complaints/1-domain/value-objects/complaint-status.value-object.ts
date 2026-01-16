import { Result } from '../../../users/1-domain/value-objects/result.value-object';

/**
 * Value Object para representar o status de uma reclamação
 * Controla o fluxo de estados possíveis da reclamação
 */
export class ComplaintStatus {
  private constructor(private readonly value: string) {}

  /**
   * Cria uma instância de ComplaintStatus a partir de uma string
   * @param value - Valor do status
   * @returns Result com ComplaintStatus ou erro
   */
  static create(value: string): Result<ComplaintStatus> {
    if (!value || typeof value !== 'string') {
      return Result.fail('Status é obrigatório');
    }

    const normalizedValue = value.toUpperCase().trim();

    const validStatuses = ['PENDENTE', 'EM_ANALISE', 'RESOLVIDA', 'REJEITADA'];

    if (!validStatuses.includes(normalizedValue)) {
      return Result.fail(`Status inválido. Status permitidos: ${validStatuses.join(', ')}`);
    }

    return Result.ok(new ComplaintStatus(normalizedValue));
  }

  /**
   * Cria uma instância de ComplaintStatus a partir de dados primitivos
   * @param value - Valor primitivo do status
   * @returns ComplaintStatus
   */
  static fromPrimitives(value: string): ComplaintStatus {
    return new ComplaintStatus(value);
  }

  /**
   * Cria status padrão (pendente) para novas reclamações
   * @returns ComplaintStatus com valor PENDENTE
   */
  static default(): ComplaintStatus {
    return new ComplaintStatus('PENDENTE');
  }

  /**
   * Retorna o valor primitivo do status
   * @returns Valor string do status
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Verifica se o status permite edição da reclamação
   * @returns True se permite edição
   */
  canBeEdited(): boolean {
    return this.value === 'PENDENTE';
  }

  /**
   * Verifica se o status indica que a reclamação está ativa
   * @returns True se estiver ativa
   */
  isActive(): boolean {
    return ['PENDENTE', 'EM_ANALISE'].includes(this.value);
  }

  /**
   * Verifica se o status indica conclusão
   * @returns True se estiver concluída
   */
  isCompleted(): boolean {
    return ['RESOLVIDA', 'REJEITADA'].includes(this.value);
  }

  /**
   * Valida se uma transição de status é permitida
   * @param newStatus - Novo status desejado
   * @returns Result indicando se a transição é válida
   */
  canTransitionTo(newStatus: ComplaintStatus): Result<void> {
    const current = this.value;
    const target = newStatus.value;

    // Regras de transição permitidas
    const validTransitions: Record<string, string[]> = {
      PENDENTE: ['EM_ANALISE', 'REJEITADA'],
      EM_ANALISE: ['RESOLVIDA', 'REJEITADA'],
      RESOLVIDA: [], // Status final, não permite transição
      REJEITADA: [], // Status final, não permite transição
    };

    if (!validTransitions[current]?.includes(target)) {
      return Result.fail(`Transição não permitida de ${current} para ${target}`);
    }

    return Result.ok();
  }

  /**
   * Verifica se duas statuses são iguais
   * @param other - Outro status para comparação
   * @returns True se forem iguais
   */
  equals(other: ComplaintStatus): boolean {
    return this.value === other.value;
  }

  /**
   * Retorna representação string do status
   * @returns String representando o status
   */
  toString(): string {
    return this.value;
  }
}

/**
 * Result pattern para operações que podem falhar
 */

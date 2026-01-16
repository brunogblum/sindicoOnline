import { Result } from '../../../users/1-domain/value-objects/result.value-object';

/**
 * Value Object para representar a urgência de uma reclamação
 * Define níveis de prioridade para tratamento adequado
 */
export class ComplaintUrgency {
  private constructor(private readonly value: string) {}

  /**
   * Cria uma instância de ComplaintUrgency a partir de uma string
   * @param value - Valor da urgência
   * @returns Result com ComplaintUrgency ou erro
   */
  static create(value: string): Result<ComplaintUrgency> {
    if (!value || typeof value !== 'string') {
      return Result.fail('Urgência é obrigatória');
    }

    const normalizedValue = value.toUpperCase().trim();

    const validUrgencies = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'];

    if (!validUrgencies.includes(normalizedValue)) {
      return Result.fail(`Urgência inválida. Urgências permitidas: ${validUrgencies.join(', ')}`);
    }

    return Result.ok(new ComplaintUrgency(normalizedValue));
  }

  /**
   * Cria uma instância de ComplaintUrgency a partir de dados primitivos
   * @param value - Valor primitivo da urgência
   * @returns ComplaintUrgency
   */
  static fromPrimitives(value: string): ComplaintUrgency {
    return new ComplaintUrgency(value);
  }

  /**
   * Retorna o valor primitivo da urgência
   * @returns Valor string da urgência
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Retorna o nível numérico de prioridade (para ordenação)
   * @returns Nível de prioridade (1 = baixa, 4 = crítica)
   */
  getPriorityLevel(): number {
    const levels = { 'BAIXA': 1, 'MEDIA': 2, 'ALTA': 3, 'CRITICA': 4 };
    return levels[this.value as keyof typeof levels] || 1;
  }

  /**
   * Verifica se é uma urgência crítica
   * @returns True se for crítica
   */
  isCritical(): boolean {
    return this.value === 'CRITICA';
  }

  /**
   * Verifica se é uma urgência alta
   * @returns True se for alta ou crítica
   */
  isHigh(): boolean {
    return ['ALTA', 'CRITICA'].includes(this.value);
  }

  /**
   * Verifica se duas urgências são iguais
   * @param other - Outra urgência para comparação
   * @returns True se forem iguais
   */
  equals(other: ComplaintUrgency): boolean {
    return this.value === other.value;
  }

  /**
   * Retorna representação string da urgência
   * @returns String representando a urgência
   */
  toString(): string {
    return this.value;
  }
}


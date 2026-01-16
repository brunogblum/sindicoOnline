import { Result } from '../../../users/1-domain/value-objects/result.value-object';

/**
 * Value Object para representar a categoria de uma reclamação
 * Garante que apenas categorias válidas sejam aceitas
 */
export class ComplaintCategory {
  private constructor(private readonly value: string) {}

  /**
   * Cria uma instância de ComplaintCategory a partir de uma string
   * @param value - Valor da categoria
   * @returns Result com ComplaintCategory ou erro
   */
  static create(value: string): Result<ComplaintCategory> {
    if (!value || typeof value !== 'string') {
      return Result.fail('Categoria é obrigatória');
    }

    const normalizedValue = value.toUpperCase().trim();

    const validCategories = [
      'INFRAESTRUTURA',
      'LIMPEZA',
      'SEGURANCA',
      'CONVENIENCIA',
      'ADMINISTRATIVO',
      'OUTROS'
    ];

    if (!validCategories.includes(normalizedValue)) {
      return Result.fail(`Categoria inválida. Categorias permitidas: ${validCategories.join(', ')}`);
    }

    return Result.ok(new ComplaintCategory(normalizedValue));
  }

  /**
   * Cria uma instância de ComplaintCategory a partir de dados primitivos
   * @param value - Valor primitivo da categoria
   * @returns ComplaintCategory
   */
  static fromPrimitives(value: string): ComplaintCategory {
    return new ComplaintCategory(value);
  }

  /**
   * Retorna o valor primitivo da categoria
   * @returns Valor string da categoria
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Verifica se duas categorias são iguais
   * @param other - Outra categoria para comparação
   * @returns True se forem iguais
   */
  equals(other: ComplaintCategory): boolean {
    return this.value === other.value;
  }

  /**
   * Retorna representação string da categoria
   * @returns String representando a categoria
   */
  toString(): string {
    return this.value;
  }
}


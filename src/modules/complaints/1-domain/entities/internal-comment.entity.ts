/**
 * Entidade de domínio que representa um comentário interno em uma reclamação
 * Comentários internos são visíveis apenas para gestores (Admin/Sindico)
 * e são usados para documentar tratativas e decisões sobre reclamações
 */
export class InternalComment {
  /**
   * Propriedades imutáveis da entidade
   */
  public readonly id: string;
  public readonly complaintId: string;
  public readonly authorId: string;
  public readonly content: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  /**
   * Construtor privado - usar factory methods para criar instâncias
   */
  private constructor(
    id: string,
    complaintId: string,
    authorId: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date
  ) {
    this.id = id;
    this.complaintId = complaintId;
    this.authorId = authorId;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  /**
   * Factory method para criar um novo comentário interno
   * @param params - Parâmetros para criação do comentário
   * @returns Instância validada da entidade InternalComment
   */
  public static create(params: {
    id?: string;
    complaintId: string;
    authorId: string;
    content: string;
  }): InternalComment {
    // Validações obrigatórias
    if (!params.complaintId?.trim()) {
      throw new Error('ID da reclamação é obrigatório');
    }

    if (!params.authorId?.trim()) {
      throw new Error('ID do autor é obrigatório');
    }

    if (!params.content?.trim()) {
      throw new Error('Conteúdo do comentário é obrigatório');
    }

    if (params.content.length > 1000) {
      throw new Error('Conteúdo do comentário não pode exceder 1000 caracteres');
    }

    const now = new Date();

    return new InternalComment(
      params.id || crypto.randomUUID(),
      params.complaintId.trim(),
      params.authorId.trim(),
      params.content.trim(),
      now,
      now
    );
  }

  /**
   * Factory method para criar instância a partir de dados primitivos (banco de dados)
   * @param primitives - Dados primitivos do banco de dados
   * @returns Instância da entidade InternalComment
   */
  public static fromPrimitives(primitives: {
    id: string;
    complaintId: string;
    authorId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): InternalComment {
    return new InternalComment(
      primitives.id,
      primitives.complaintId,
      primitives.authorId,
      primitives.content,
      primitives.createdAt,
      primitives.updatedAt,
      primitives.deletedAt
    );
  }

  /**
   * Cria uma nova instância com conteúdo atualizado
   * @param newContent - Novo conteúdo do comentário
   * @returns Nova instância com conteúdo atualizado
   */
  public updateContent(newContent: string): InternalComment {
    if (!newContent?.trim()) {
      throw new Error('Conteúdo do comentário é obrigatório');
    }

    if (newContent.length > 1000) {
      throw new Error('Conteúdo do comentário não pode exceder 1000 caracteres');
    }

    return new InternalComment(
      this.id,
      this.complaintId,
      this.authorId,
      newContent.trim(),
      this.createdAt,
      new Date(), // updatedAt atualizado
      this.deletedAt
    );
  }

  /**
   * Cria uma nova instância marcada como deletada
   * @returns Nova instância marcada como deletada
   */
  public markAsDeleted(): InternalComment {
    return new InternalComment(
      this.id,
      this.complaintId,
      this.authorId,
      this.content,
      this.createdAt,
      this.updatedAt,
      new Date() // deletedAt definido
    );
  }

  /**
   * Verifica se o comentário foi deletado
   * @returns true se o comentário foi deletado
   */
  public isDeleted(): boolean {
    return this.deletedAt !== undefined;
  }

  /**
   * Converte a entidade para formato primitivo (útil para serialização)
   * @returns Dados primitivos da entidade
   */
  public toPrimitives() {
    return {
      id: this.id,
      complaintId: this.complaintId,
      authorId: this.authorId,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}





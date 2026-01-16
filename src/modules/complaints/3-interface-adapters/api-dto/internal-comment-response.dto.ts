/**
 * DTO para dados do autor de um comentário interno
 */
export class InternalCommentAuthorDto {
  /**
   * ID do autor do comentário
   */
  id!: string;

  /**
   * Nome do autor do comentário
   */
  name!: string;

  /**
   * Papel do autor (ADMIN, SINDICO)
   */
  role!: string;
}

/**
 * DTO para resposta de comentário interno
 */
export class InternalCommentResponseDto {
  /**
   * ID único do comentário
   */
  id!: string;

  /**
   * ID da reclamação à qual o comentário pertence
   */
  complaintId!: string;

  /**
   * ID do autor do comentário
   */
  authorId!: string;

  /**
   * Conteúdo do comentário
   */
  content!: string;

  /**
   * Data de criação do comentário
   */
  createdAt!: Date;

  /**
   * Data da última atualização do comentário
   */
  updatedAt!: Date;

  /**
   * Data de exclusão do comentário (soft delete)
   */
  deletedAt?: Date;
}

/**
 * DTO para resposta completa de comentário interno com dados do autor
 */
export class InternalCommentWithAuthorResponseDto {
  /**
   * Dados do comentário
   */
  comment!: InternalCommentResponseDto;

  /**
   * Dados do autor do comentário
   */
  author!: InternalCommentAuthorDto;
}

/**
 * DTO para resposta paginada de comentários internos
 */
export class ListInternalCommentsResponseDto {
  /**
   * Lista de comentários com dados dos autores
   */
  comments!: InternalCommentWithAuthorResponseDto[];

  /**
   * Número total de comentários
   */
  total!: number;

  /**
   * Página atual
   */
  page!: number;

  /**
   * Número de itens por página
   */
  limit!: number;

  /**
   * Número total de páginas
   */
  totalPages!: number;
}





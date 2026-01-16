import { IsNotEmpty, IsString, MaxLength, IsUUID } from 'class-validator';

/**
 * DTO para requisição de adição de comentário interno
 * Apenas gestores (Admin/Sindico) podem adicionar comentários internos
 */
export class AddInternalCommentRequestDto {
  /**
   * ID da reclamação onde o comentário será adicionado
   */
  @IsUUID('4', { message: 'ID da reclamação deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID da reclamação é obrigatório' })
  complaintId!: string;

  /**
   * Conteúdo do comentário interno
   * Máximo de 1000 caracteres para manter comentários concisos
   */
  @IsString({ message: 'Conteúdo deve ser uma string' })
  @IsNotEmpty({ message: 'Conteúdo do comentário é obrigatório' })
  @MaxLength(1000, { message: 'Conteúdo não pode exceder 1000 caracteres' })
  content!: string;
}





import { IsString, IsOptional, IsBoolean, MinLength, MaxLength, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO para requisição de criação de reclamação
 * Inclui validações e sanitização de dados
 */
export class CreateComplaintRequestDto {
  @IsString({ message: 'Categoria é obrigatória e deve ser um texto' })
  @IsIn(['INFRAESTRUTURA', 'LIMPEZA', 'SEGURANCA', 'CONVENIENCIA', 'ADMINISTRATIVO', 'OUTROS'], {
    message: 'Categoria deve ser uma das opções: INFRAESTRUTURA, LIMPEZA, SEGURANCA, CONVENIENCIA, ADMINISTRATIVO, OUTROS'
  })
  @Transform(({ value }) => value?.toUpperCase().trim())
  category: string;

  @IsString({ message: 'Descrição é obrigatória e deve ser um texto' })
  @MinLength(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsString({ message: 'Urgência é obrigatória e deve ser um texto' })
  @IsIn(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'], {
    message: 'Urgência deve ser uma das opções: BAIXA, MEDIA, ALTA, CRITICA'
  })
  @Transform(({ value }) => value?.toUpperCase().trim())
  urgency: string;

  @IsOptional()
  @IsBoolean({ message: 'Campo anônimo deve ser um valor booleano' })
  isAnonymous?: boolean;
}





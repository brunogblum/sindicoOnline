/**
 * DTO de resposta para reclamações - visão do próprio autor
 * Mostra sempre os dados da reclamação (mesmo que anônima para outros)
 */
export class ComplaintOwnResponseDto {
  id: string;
  category: string;
  description: string;
  urgency: string;
  status: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}





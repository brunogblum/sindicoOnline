/**
 * DTO de resposta para reclamações - visão limitada (Morador)
 * Oculta dados do autor quando isAnonymous=true
 */
export class ComplaintLimitedResponseDto {
  id: string;
  authorDisplay: string; // "Anônimo" ou nome do autor
  category: string;
  description: string;
  urgency: string;
  status: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}





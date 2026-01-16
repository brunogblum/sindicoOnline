/**
 * DTO de resposta para reclamações - visão completa (Admin/Síndico)
 * Mostra todas as informações incluindo dados do autor
 */
export class ComplaintFullResponseDto {
  id: string;
  authorId: string;
  authorName: string;
  authorBlock?: string | null;
  authorApartment?: string | null;
  category: string;
  description: string;
  urgency: string;
  status: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}





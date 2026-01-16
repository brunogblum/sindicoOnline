import { ComplaintCategory } from '../../1-domain/value-objects/complaint-category.value-object';
import { ComplaintUrgency } from '../../1-domain/value-objects/complaint-urgency.value-object';
import { ComplaintStatus } from '../../1-domain/value-objects/complaint-status.value-object';

/**
 * DTO para criação de nova reclamação
 */
export interface CreateComplaintDto {
  authorId: string;
  category: string; // Será convertido para ComplaintCategory
  description: string;
  urgency: string; // Será convertido para ComplaintUrgency
  isAnonymous?: boolean;
}

/**
 * DTO de saída para reclamações - visão completa (Admin/Síndico)
 * Mostra todas as informações incluindo dados do autor
 */
export interface ComplaintFullOutputDto {
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

/**
 * DTO de saída para reclamações - visão limitada (Morador)
 * Oculta dados do autor quando isAnonymous=true
 */
export interface ComplaintLimitedOutputDto {
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

/**
 * DTO de saída para reclamações - visão do próprio autor
 * Mostra sempre os dados do autor (mesmo que anônima para outros)
 */
export interface ComplaintOwnOutputDto {
  id: string;
  category: string;
  description: string;
  urgency: string;
  status: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}





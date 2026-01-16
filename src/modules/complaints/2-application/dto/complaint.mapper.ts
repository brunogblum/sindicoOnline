import { Complaint } from '../../1-domain/entities/complaint.entity';
import {
  ComplaintFullOutputDto,
  ComplaintLimitedOutputDto,
  ComplaintOwnOutputDto
} from './complaint.dto';

/**
 * Classe responsável por mapear entidades Complaint para DTOs de saída
 * Implementa diferentes visões dependendo do contexto e permissões do usuário
 */
export class ComplaintMapper {
  /**
   * Converte Complaint para DTO completo (Admin/Síndico)
   * @param complaint - Entidade da reclamação
   * @param authorName - Nome do autor
   * @param authorBlock - Bloco do autor
   * @param authorApartment - Apartamento do autor
   * @returns DTO completo da reclamação
   */
  static toFullDto(
    complaint: Complaint,
    authorName: string,
    authorBlock?: string | null,
    authorApartment?: string | null
  ): ComplaintFullOutputDto {
    return {
      id: complaint.id,
      authorId: complaint.authorId,
      authorName,
      authorBlock,
      authorApartment,
      category: complaint.category.getValue(),
      description: complaint.description,
      urgency: complaint.urgency.getValue(),
      status: complaint.status.getValue(),
      isAnonymous: complaint.isAnonymous,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      deletedAt: complaint.deletedAt,
    };
  }

  /**
   * Converte Complaint para DTO limitado (Morador)
   * @param complaint - Entidade da reclamação
   * @param authorName - Nome do autor (para casos não anônimos)
   * @returns DTO limitado da reclamação
   */
  static toLimitedDto(complaint: Complaint, authorName?: string): ComplaintLimitedOutputDto {
    const authorDisplay = authorName || (complaint.isAnonymous ? 'Anônimo' : 'Desconhecido');

    return {
      id: complaint.id,
      authorDisplay,
      category: complaint.category.getValue(),
      description: complaint.description,
      urgency: complaint.urgency.getValue(),
      status: complaint.status.getValue(),
      isAnonymous: complaint.isAnonymous,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      deletedAt: complaint.deletedAt,
    };
  }

  /**
   * Converte Complaint para DTO próprio (do autor da reclamação)
   * @param complaint - Entidade da reclamação
   * @returns DTO da própria reclamação
   */
  static toOwnDto(complaint: Complaint): ComplaintOwnOutputDto {
    return {
      id: complaint.id,
      category: complaint.category.getValue(),
      description: complaint.description,
      urgency: complaint.urgency.getValue(),
      status: complaint.status.getValue(),
      isAnonymous: complaint.isAnonymous,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      deletedAt: complaint.deletedAt,
    };
  }
}





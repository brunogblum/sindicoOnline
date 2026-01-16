import { SupportedMimeType } from '../../1-domain';

/**
 * DTO para entrada do use case de upload de evidências
 */
export interface UploadEvidenceDto {
  /** ID da reclamação */
  complaintId: string;
  /** ID do usuário que está fazendo upload */
  userId: string;
  /** Lista de arquivos enviados */
  files: Array<{
    originalName: string;
    mimeType: string;
    size: number;
    buffer?: Buffer;
    filename?: string;
  }>;
}

/**
 * Resultado do upload de evidências
 */
export interface UploadEvidenceResult {
  /** Evidências criadas com sucesso */
  evidences: Array<{
    id: string;
    originalName: string;
    mimeType: SupportedMimeType;
    size: number;
    uploadedAt: Date;
  }>;
  /** Número total de arquivos processados */
  totalFiles: number;
}





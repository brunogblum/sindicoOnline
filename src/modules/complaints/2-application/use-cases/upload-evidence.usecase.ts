import { Inject, Injectable } from '@nestjs/common';
import { COMPLAINTS_TOKENS } from '../../4-infrastructure/di/complaints.tokens';
import type { ComplaintEvidenceRepositoryContract } from '../../1-domain/contracts/complaint-evidence.repository.contract';
import type { ComplaintRepositoryContract } from '../../1-domain/contracts/complaint.repository.contract';
import type { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { ComplaintEvidence, SupportedMimeType, MimeTypeMapping } from '../../1-domain/value-objects/complaint-evidence.value-object';
import { Result } from '../../../users/1-domain/value-objects/result.value-object';
import { UploadEvidenceDto, UploadEvidenceResult } from '../dto/upload-evidence.dto';

/**
 * Caso de uso para upload de evidências de reclamações
 * Responsável por validar e salvar arquivos de evidência
 */
@Injectable()
export class UploadEvidenceUseCase {
  constructor(
    @Inject(COMPLAINTS_TOKENS.COMPLAINT_EVIDENCE_REPOSITORY)
    private readonly evidenceRepository: ComplaintEvidenceRepositoryContract,
    @Inject(COMPLAINTS_TOKENS.COMPLAINT_REPOSITORY)
    private readonly complaintRepository: ComplaintRepositoryContract,
    @Inject(COMPLAINTS_TOKENS.LOGGER)
    private readonly logger: LoggerContract,
  ) {}

  /**
   * Executa o upload de evidências para uma reclamação
   * @param dto - Dados do upload
   * @returns Result com as evidências criadas ou erro
   */
  async execute(dto: UploadEvidenceDto): Promise<Result<UploadEvidenceResult>> {
    this.logger.log('Iniciando upload de evidências', {
      complaintId: dto.complaintId,
      userId: dto.userId,
      fileCount: dto.files.length,
    });

    // Valida se a reclamação existe
    const complaintExists = await this.evidenceRepository.complaintExists(dto.complaintId);
    if (!complaintExists) {
      this.logger.warn('Tentativa de upload para reclamação inexistente', {
        complaintId: dto.complaintId,
        userId: dto.userId,
      });
      return Result.fail('Reclamação não encontrada');
    }

    // Valida se o usuário tem permissão (deve ser o autor da reclamação)
    const complaint = await this.complaintRepository.findById(dto.complaintId);
    if (!complaint) {
      return Result.fail('Reclamação não encontrada');
    }

    if (complaint.authorId !== dto.userId) {
      this.logger.warn('Tentativa de upload não autorizada', {
        complaintId: dto.complaintId,
        userId: dto.userId,
        authorId: complaint.authorId,
      });
      return Result.fail('Apenas o autor da reclamação pode anexar evidências');
    }

    // Verifica se a reclamação permite edição
    if (!complaint.canBeEdited()) {
      this.logger.warn('Tentativa de upload em reclamação não editável', {
        complaintId: dto.complaintId,
        status: complaint.status,
        isDeleted: complaint.deletedAt !== null,
      });
      return Result.fail('Não é possível anexar evidências a esta reclamação');
    }

    // Processa cada arquivo
    const evidences: ComplaintEvidence[] = [];
    const errors: string[] = [];

    for (const file of dto.files) {
      const evidenceResult = ComplaintEvidence.create(
        crypto.randomUUID(), // Gera ID único
        dto.complaintId,
        file.originalName,
        file.mimeType,
        file.size,
      );

      if (evidenceResult.isFailure) {
        errors.push(`Arquivo ${file.originalName}: ${evidenceResult.error}`);
        continue;
      }

      // Salva a evidência
      const saveResult = await this.evidenceRepository.save(evidenceResult.getValue());
      if (saveResult.isFailure) {
        errors.push(`Erro ao salvar ${file.originalName}: ${saveResult.error}`);
        continue;
      }

      evidences.push(saveResult.getValue());
    }

    // Se nenhum arquivo foi processado com sucesso
    if (evidences.length === 0) {
      const errorMessage = errors.length > 0 ? errors.join('; ') : 'Nenhum arquivo válido foi enviado';
      return Result.fail(errorMessage);
    }

    // Log de sucesso parcial ou total
    if (errors.length > 0) {
      this.logger.warn('Upload de evidências com erros parciais', {
        complaintId: dto.complaintId,
        successful: evidences.length,
        failed: errors.length,
        errors,
      });
    } else {
      this.logger.log('Upload de evidências concluído com sucesso', {
        complaintId: dto.complaintId,
        filesCount: evidences.length,
      });
    }

    const result: UploadEvidenceResult = {
      evidences: evidences.map(evidence => ({
        id: evidence.id,
        originalName: evidence.originalName,
        mimeType: evidence.mimeType,
        size: evidence.size,
        uploadedAt: evidence.uploadedAt,
      })),
      totalFiles: evidences.length,
    };

    return Result.ok(result);
  }
}

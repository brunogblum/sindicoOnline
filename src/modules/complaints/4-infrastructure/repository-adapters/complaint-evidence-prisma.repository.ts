import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import type { ComplaintEvidenceRepositoryContract } from '../../1-domain/contracts/complaint-evidence.repository.contract';
import { ComplaintEvidence, SupportedMimeType, MimeTypeMapping } from '../../1-domain/value-objects/complaint-evidence.value-object';
import { Result } from '../../../users/1-domain/value-objects/result.value-object';
import type { LoggerContract } from '../../1-domain/contracts/logger.contract';

/**
 * Implementação Prisma do repositório de evidências de reclamações
 */
@Injectable()
export class ComplaintEvidencePrismaRepository implements ComplaintEvidenceRepositoryContract {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerContract,
  ) {}

  async save(evidence: ComplaintEvidence): Promise<Result<ComplaintEvidence>> {
    try {
      this.logger.log('Salvando evidência no banco de dados', {
        evidenceId: evidence.id,
        complaintId: evidence.complaintId,
        fileName: evidence.fileName,
      });

      const data = {
        id: evidence.id,
        complaintId: evidence.complaintId,
        originalName: evidence.originalName,
        mimeType: evidence.mimeType,
        size: evidence.size,
        fileName: evidence.fileName,
        uploadedAt: evidence.uploadedAt,
      };

      await this.prisma.complaintEvidence.create({ data });

      this.logger.log('Evidência salva com sucesso', {
        evidenceId: evidence.id,
      });

      return Result.ok(evidence);
    } catch (error) {
      this.logger.error(
        'Erro ao salvar evidência',
        error instanceof Error ? error.stack : undefined,
        {
          evidenceId: evidence.id,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }
      );
      return Result.fail('Erro interno do servidor ao salvar evidência');
    }
  }

  async findByComplaintId(complaintId: string): Promise<Result<ComplaintEvidence[]>> {
    try {
      this.logger.log('Buscando evidências por ID da reclamação', {
        complaintId,
      });

      const evidencesData = await this.prisma.complaintEvidence.findMany({
        where: { complaintId },
        orderBy: { uploadedAt: 'desc' },
      });

      const evidences = evidencesData.map(data =>
        ComplaintEvidence.inflate(
          data.id,
          data.complaintId,
          data.originalName,
          data.mimeType as SupportedMimeType,
          data.size,
          data.fileName,
          data.uploadedAt,
        )
      );

      this.logger.log('Evidências encontradas', {
        complaintId,
        count: evidences.length,
      });

      return Result.ok(evidences);
    } catch (error) {
      this.logger.error(
        'Erro ao buscar evidências',
        error instanceof Error ? error.stack : undefined,
        {
          complaintId,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }
      );
      return Result.fail('Erro interno do servidor ao buscar evidências');
    }
  }

  async findById(evidenceId: string): Promise<Result<ComplaintEvidence | null>> {
    try {
      this.logger.log('Buscando evidência por ID', {
        evidenceId,
      });

      const data = await this.prisma.complaintEvidence.findUnique({
        where: { id: evidenceId },
      });

      if (!data) {
        this.logger.log('Evidência não encontrada', {
          evidenceId,
        });
        return Result.ok(null);
      }

      const evidence = ComplaintEvidence.inflate(
        data.id,
        data.complaintId,
        data.originalName,
        data.mimeType as SupportedMimeType,
        data.size,
        data.fileName,
        data.uploadedAt,
      );

      return Result.ok(evidence);
    } catch (error) {
      this.logger.error(
        'Erro ao buscar evidência por ID',
        error instanceof Error ? error.stack : undefined,
        {
          evidenceId,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }
      );
      return Result.fail('Erro interno do servidor ao buscar evidência');
    }
  }

  async delete(evidenceId: string): Promise<Result<void>> {
    try {
      this.logger.log('Removendo evidência', {
        evidenceId,
      });

      await this.prisma.complaintEvidence.delete({
        where: { id: evidenceId },
      });

      this.logger.log('Evidência removida com sucesso', {
        evidenceId,
      });

      return Result.ok(undefined);
    } catch (error) {
      this.logger.error(
        'Erro ao remover evidência',
        error instanceof Error ? error.stack : undefined,
        {
          evidenceId,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }
      );
      return Result.fail('Erro interno do servidor ao remover evidência');
    }
  }

  async complaintExists(complaintId: string): Promise<boolean> {
    try {
      const count = await this.prisma.complaint.count({
        where: { id: complaintId },
      });
      return count > 0;
    } catch (error) {
      this.logger.error(
        'Erro ao verificar existência da reclamação',
        error instanceof Error ? error.stack : undefined,
        {
          complaintId,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }
      );
      return false;
    }
  }
}

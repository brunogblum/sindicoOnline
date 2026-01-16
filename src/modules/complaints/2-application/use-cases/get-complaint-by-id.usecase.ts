import { Result } from '../../../users/1-domain/value-objects/result.value-object';
import { ComplaintRepositoryContract, ComplaintWithAuthor } from '../../1-domain/contracts/complaint.repository.contract';
import { InternalCommentRepositoryContract } from '../../1-domain/contracts/internal-comment.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { ComplaintStatusHistory } from '../../1-domain/entities/complaint-status-history.entity';
import { InternalCommentWithAuthor } from '../../1-domain/contracts/internal-comment.repository.contract';
import { ComplaintEvidenceRepositoryContract } from '../../1-domain/contracts/complaint-evidence.repository.contract';
import { ComplaintMapper } from '../dto/complaint.mapper';
import { ComplaintFullOutputDto, ComplaintLimitedOutputDto } from '../dto/complaint.dto';

export interface GetComplaintByIdInput {
    complaintId: string;
    userId: string;
    userRole: string;
}

export interface GetComplaintByIdOutput {
    complaint: ComplaintFullOutputDto | ComplaintLimitedOutputDto;
    history: any[];
    comments?: InternalCommentWithAuthor[];
    evidences?: any[];
}

export class GetComplaintByIdUseCase {
    constructor(
        private readonly complaintRepository: ComplaintRepositoryContract,
        private readonly internalCommentRepository: InternalCommentRepositoryContract,
        private readonly evidenceRepository: ComplaintEvidenceRepositoryContract,
        private readonly logger: LoggerContract
    ) { }

    async execute(input: GetComplaintByIdInput): Promise<Result<GetComplaintByIdOutput>> {
        try {
            this.logger.log('Buscando detalhes da reclamação', { complaintId: input.complaintId });

            const complaint = await this.complaintRepository.findById(input.complaintId);

            if (!complaint) {
                return Result.fail('Reclamação não encontrada');
            }

            // Verificar permissão
            const isAuthor = complaint.authorId === input.userId;
            const isStaff = ['SINDICO', 'ADMIN'].includes(input.userRole);

            if (!isAuthor && !isStaff) {
                return Result.fail('Você não tem permissão para visualizar esta reclamação');
            }

            // Buscar todas as reclamações (incluindo dados do autor) via repositório
            // findWithFilters já retorna os dados do autor mapeados corretamente
            const filteredResult = await this.complaintRepository.findWithFilters(
                {}, // filtros vazios para pegar tudo
                { page: 1, limit: 1000 }, // pegamos uma quantidade razoável
                false
            );

            const found = filteredResult.complaints.find(c => c.complaint.id === input.complaintId);

            if (!found) {
                return Result.fail('Reclamação não encontrada ou acesso negado');
            }

            // Mapear para DTO usando o Mapper para garantir serialização correta
            let mappedComplaint: ComplaintFullOutputDto | ComplaintLimitedOutputDto;

            if (isStaff) {
                mappedComplaint = ComplaintMapper.toFullDto(
                    found.complaint,
                    found.author?.name || 'Sistema',
                    found.author?.block,
                    found.author?.apartment
                );
            } else {
                // Se for o autor, podemos mostrar a visão completa ou própria
                mappedComplaint = ComplaintMapper.toFullDto(
                    found.complaint,
                    found.author?.name || 'Você',
                    found.author?.block,
                    found.author?.apartment
                );
            }

            // Buscar histórico
            const history = await this.complaintRepository.findStatusHistory(input.complaintId);

            // Garantir que o histórico também use strings para status
            const serializedHistory = history.map(h => ({
                id: h.getId(),
                complaintId: h.getComplaintId(),
                previousStatus: h.getPreviousStatus().getValue(),
                newStatus: h.getNewStatus().getValue(),
                changedBy: h.getChangedBy(),
                changedAt: h.getChangedAt(),
                reason: h.getReason()
            }));

            // Buscar comentários se for Staff
            let comments: InternalCommentWithAuthor[] | undefined;
            if (isStaff) {
                const commentsResult = await this.internalCommentRepository.findWithFilters(
                    { complaintId: input.complaintId },
                    { page: 1, limit: 100 },
                    false
                );
                comments = commentsResult.comments;
            }

            // Buscar evidências
            const evidencesResult = await this.evidenceRepository.findByComplaintId(input.complaintId);
            const rawEvidences = evidencesResult.isSuccess ? evidencesResult.getValue() : [];
            const evidences = rawEvidences.map(e => ({
                id: e.id,
                complaintId: e.complaintId,
                originalName: e.originalName,
                mimeType: e.mimeType,
                size: e.size,
                fileName: e.fileName,
                uploadedAt: e.uploadedAt
            }));

            return Result.ok({
                complaint: mappedComplaint,
                history: serializedHistory as any,
                comments,
                evidences
            });

        } catch (error) {
            this.logger.error('Erro ao buscar detalhes da reclamação', error instanceof Error ? error.stack : undefined);
            return Result.fail('Erro interno ao buscar detalhes da reclamação');
        }
    }
}

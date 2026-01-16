import type { ComplaintRepositoryContract } from '../../1-domain/contracts/complaint.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';
import { CreateComplaintDto, ComplaintOwnOutputDto } from '../dto/complaint.dto';
import { ComplaintMapper } from '../dto/complaint.mapper';
import { Complaint } from '../../1-domain/entities/complaint.entity';
import { ComplaintCategory } from '../../1-domain/value-objects/complaint-category.value-object';
import { ComplaintUrgency } from '../../1-domain/value-objects/complaint-urgency.value-object';
import { Result } from '../../1-domain';
import { randomUUID } from 'crypto';

/**
 * Caso de uso para criação de reclamações
 * Implementa validações de negócio e controle de spam/abuso
 */
export class CreateComplaintUseCase {
  constructor(
    private readonly complaintRepository: ComplaintRepositoryContract,
    private readonly logger: LoggerContract,
  ) {}

  async execute(dto: CreateComplaintDto): Promise<Result<ComplaintOwnOutputDto>> {
    try {
      this.logger.log('Executando CreateComplaintUseCase', {
        authorId: dto.authorId,
        category: dto.category,
        urgency: dto.urgency,
        isAnonymous: dto.isAnonymous
      });

      // Validação e criação dos value objects
      const categoryResult = ComplaintCategory.create(dto.category);
      if (categoryResult.isFailure) {
        this.logger.warn('Categoria inválida na criação de reclamação', {
          authorId: dto.authorId,
          category: dto.category,
          error: categoryResult.error
        });
        return Result.fail(categoryResult.error!);
      }

      const urgencyResult = ComplaintUrgency.create(dto.urgency);
      if (urgencyResult.isFailure) {
        this.logger.warn('Urgência inválida na criação de reclamação', {
          authorId: dto.authorId,
          urgency: dto.urgency,
          error: urgencyResult.error
        });
        return Result.fail(urgencyResult.error!);
      }

      // Validações contra spam/abuso
      const spamValidation = await this.validateAgainstSpam(dto.authorId);
      if (spamValidation.isFailure) {
        this.logger.warn('Tentativa de spam bloqueada', {
          authorId: dto.authorId,
          reason: spamValidation.error
        });
        return Result.fail(spamValidation.error);
      }

      // Cria a entidade
      const id = randomUUID();
      const complaintResult = Complaint.create(
        id,
        dto.authorId,
        categoryResult.getValue(),
        dto.description,
        urgencyResult.getValue(),
        dto.isAnonymous || false
      );

      if (complaintResult.isFailure) {
        this.logger.warn('Falha na criação da entidade Complaint', {
          authorId: dto.authorId,
          error: complaintResult.error
        });
        return Result.fail(complaintResult.error!);
      }

      const complaint = complaintResult.getValue();

      // Salva no repositório
      await this.complaintRepository.save(complaint);

      this.logger.log('Reclamação criada com sucesso', {
        complaintId: complaint.id,
        authorId: dto.authorId,
        isAnonymous: dto.isAnonymous
      });

      return Result.ok(ComplaintMapper.toOwnDto(complaint));

    } catch (error) {
      this.logger.error('Erro inesperado na criação de reclamação', (error as Error).stack, {
        authorId: dto.authorId,
        category: dto.category
      });
      return Result.fail('Erro inesperado ao criar reclamação');
    }
  }

  /**
   * Validações contra spam e abuso
   * @param authorId - ID do autor da reclamação
   * @returns Result indicando se a operação pode prosseguir
   */
  private async validateAgainstSpam(authorId: string): Promise<Result<void>> {
    // Verifica número de reclamações nas últimas 24 horas
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const complaintsCount = await this.complaintRepository.countByAuthorInPeriod(authorId, oneDayAgo);

    // Limite: máximo 5 reclamações por dia
    if (complaintsCount >= 5) {
      return Result.fail('Limite de reclamações diárias atingido. Tente novamente amanhã.');
    }

    return Result.ok(undefined);
  }
}

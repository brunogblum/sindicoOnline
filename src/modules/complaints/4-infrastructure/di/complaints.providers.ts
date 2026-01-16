import { Provider } from '@nestjs/common';
import { COMPLAINTS_TOKENS } from './complaints.tokens';

import { ComplaintPrismaRepository } from '../repository-adapters/complaint-prisma.repository';
import { ComplaintEvidencePrismaRepository } from '../repository-adapters/complaint-evidence-prisma.repository';
import { InternalCommentPrismaRepository, createInternalCommentPrismaRepository } from '../repository-adapters/internal-comment-prisma.repository';
import { AuditPrismaRepository, createAuditPrismaRepository } from '../repository-adapters/audit-prisma.repository';
import { ComplaintLoggerService, createComplaintLogger } from '../services/complaint-logger.service';

import { CreateComplaintUseCase } from '../../2-application/use-cases/create-complaint.usecase';
import { ListComplaintsUseCase } from '../../2-application/use-cases/list-complaints.usecase';
import { UploadEvidenceUseCase } from '../../2-application/use-cases/upload-evidence.usecase';
import { UpdateComplaintStatusUseCase } from '../../2-application/use-cases/update-complaint-status.usecase';
import { AddInternalCommentUseCase } from '../../2-application/use-cases/add-internal-comment.usecase';
import { ListInternalCommentsUseCase } from '../../2-application/use-cases/list-internal-comments.usecase';
import { ListAuditLogsUseCase } from '../../2-application/use-cases/list-audit-logs.usecase';
import { GetComplaintByIdUseCase } from '../../2-application/use-cases/get-complaint-by-id.usecase';

import { PrismaService } from '../../../prisma/prisma.service';
import { ComplaintRepositoryContract } from '../../1-domain/contracts/complaint.repository.contract';
import { ComplaintEvidenceRepositoryContract } from '../../1-domain/contracts/complaint-evidence.repository.contract';
import { InternalCommentRepositoryContract } from '../../1-domain/contracts/internal-comment.repository.contract';
import { AuditRepositoryContract } from '../../1-domain/contracts/audit.repository.contract';
import { LoggerContract } from '../../1-domain/contracts/logger.contract';

// Factories para repositórios
export const createComplaintRepositoryFactory = (
  prisma: PrismaService,
  logger: LoggerContract
) => {
  return new ComplaintPrismaRepository(prisma, logger);
};

export const createComplaintEvidenceRepositoryFactory = (
  prisma: PrismaService,
  logger: LoggerContract
) => {
  return new ComplaintEvidencePrismaRepository(prisma, logger);
};

export const createInternalCommentRepositoryFactory = (
  prisma: PrismaService,
  logger: LoggerContract
) => {
  return createInternalCommentPrismaRepository(prisma, logger);
};

export const createAuditRepositoryFactory = (
  prisma: PrismaService,
  logger: LoggerContract
) => {
  return createAuditPrismaRepository(prisma, logger);
};

// Factories para casos de uso
export const createCreateComplaintUseCaseFactory = (
  repo: ComplaintRepositoryContract,
  logger: LoggerContract
) => {
  return new CreateComplaintUseCase(repo, logger);
};

export const createListComplaintsUseCaseFactory = (
  repo: ComplaintRepositoryContract,
  logger: LoggerContract
) => {
  return new ListComplaintsUseCase(repo, logger);
};

export const createUploadEvidenceUseCaseFactory = (
  evidenceRepo: ComplaintEvidenceRepositoryContract,
  complaintRepo: ComplaintRepositoryContract,
  logger: LoggerContract
) => {
  return new UploadEvidenceUseCase(evidenceRepo, complaintRepo, logger);
};

export const createUpdateComplaintStatusUseCaseFactory = (
  repo: ComplaintRepositoryContract,
  logger: LoggerContract
) => {
  return new UpdateComplaintStatusUseCase(repo, logger);
};

export const createAddInternalCommentUseCaseFactory = (
  internalCommentRepo: InternalCommentRepositoryContract,
  auditRepo: AuditRepositoryContract,
  logger: LoggerContract
) => {
  return new AddInternalCommentUseCase(internalCommentRepo, auditRepo, logger);
};

export const createListInternalCommentsUseCaseFactory = (
  internalCommentRepo: InternalCommentRepositoryContract,
  logger: LoggerContract
) => {
  return new ListInternalCommentsUseCase(internalCommentRepo, logger);
};

export const createListAuditLogsUseCaseFactory = (
  auditRepo: AuditRepositoryContract,
  logger: LoggerContract
) => {
  return new ListAuditLogsUseCase(auditRepo, logger);
};

export const createGetComplaintByIdUseCaseFactory = (
  complaintRepo: ComplaintRepositoryContract,
  internalCommentRepo: InternalCommentRepositoryContract,
  evidenceRepo: ComplaintEvidenceRepositoryContract,
  logger: LoggerContract
) => {
  return new GetComplaintByIdUseCase(complaintRepo, internalCommentRepo, evidenceRepo, logger);
};

export const complaintsProviders: Provider[] = [
  // Serviços de infraestrutura
  {
    provide: COMPLAINTS_TOKENS.LOGGER,
    useFactory: createComplaintLogger,
  },

  // Repositórios
  {
    provide: COMPLAINTS_TOKENS.COMPLAINT_REPOSITORY,
    useFactory: createComplaintRepositoryFactory,
    inject: [PrismaService, COMPLAINTS_TOKENS.LOGGER],
  },
  {
    provide: COMPLAINTS_TOKENS.COMPLAINT_EVIDENCE_REPOSITORY,
    useFactory: createComplaintEvidenceRepositoryFactory,
    inject: [PrismaService, COMPLAINTS_TOKENS.LOGGER],
  },
  {
    provide: COMPLAINTS_TOKENS.INTERNAL_COMMENT_REPOSITORY,
    useFactory: createInternalCommentRepositoryFactory,
    inject: [PrismaService, COMPLAINTS_TOKENS.LOGGER],
  },
  {
    provide: COMPLAINTS_TOKENS.AUDIT_REPOSITORY,
    useFactory: createAuditRepositoryFactory,
    inject: [PrismaService, COMPLAINTS_TOKENS.LOGGER],
  },

  // Casos de uso
  {
    provide: COMPLAINTS_TOKENS.CREATE_COMPLAINT_USECASE,
    useFactory: createCreateComplaintUseCaseFactory,
    inject: [COMPLAINTS_TOKENS.COMPLAINT_REPOSITORY, COMPLAINTS_TOKENS.LOGGER],
  },
  {
    provide: COMPLAINTS_TOKENS.LIST_COMPLAINTS_USECASE,
    useFactory: createListComplaintsUseCaseFactory,
    inject: [COMPLAINTS_TOKENS.COMPLAINT_REPOSITORY, COMPLAINTS_TOKENS.LOGGER],
  },
  {
    provide: COMPLAINTS_TOKENS.UPLOAD_EVIDENCE_USECASE,
    useFactory: createUploadEvidenceUseCaseFactory,
    inject: [
      COMPLAINTS_TOKENS.COMPLAINT_EVIDENCE_REPOSITORY,
      COMPLAINTS_TOKENS.COMPLAINT_REPOSITORY,
      COMPLAINTS_TOKENS.LOGGER,
    ],
  },
  {
    provide: COMPLAINTS_TOKENS.UPDATE_COMPLAINT_STATUS_USECASE,
    useFactory: createUpdateComplaintStatusUseCaseFactory,
    inject: [COMPLAINTS_TOKENS.COMPLAINT_REPOSITORY, COMPLAINTS_TOKENS.LOGGER],
  },
  {
    provide: COMPLAINTS_TOKENS.ADD_INTERNAL_COMMENT_USECASE,
    useFactory: createAddInternalCommentUseCaseFactory,
    inject: [
      COMPLAINTS_TOKENS.INTERNAL_COMMENT_REPOSITORY,
      COMPLAINTS_TOKENS.AUDIT_REPOSITORY,
      COMPLAINTS_TOKENS.LOGGER,
    ],
  },
  {
    provide: COMPLAINTS_TOKENS.LIST_INTERNAL_COMMENTS_USECASE,
    useFactory: createListInternalCommentsUseCaseFactory,
    inject: [COMPLAINTS_TOKENS.INTERNAL_COMMENT_REPOSITORY, COMPLAINTS_TOKENS.LOGGER],
  },
  {
    provide: COMPLAINTS_TOKENS.LIST_AUDIT_LOGS_USECASE,
    useFactory: createListAuditLogsUseCaseFactory,
    inject: [COMPLAINTS_TOKENS.AUDIT_REPOSITORY, COMPLAINTS_TOKENS.LOGGER],
  },
  {
    provide: COMPLAINTS_TOKENS.GET_COMPLAINT_BY_ID_USECASE,
    useFactory: createGetComplaintByIdUseCaseFactory,
    inject: [
      COMPLAINTS_TOKENS.COMPLAINT_REPOSITORY,
      COMPLAINTS_TOKENS.INTERNAL_COMMENT_REPOSITORY,
      COMPLAINTS_TOKENS.COMPLAINT_EVIDENCE_REPOSITORY,
      COMPLAINTS_TOKENS.LOGGER,
    ],
  },
];

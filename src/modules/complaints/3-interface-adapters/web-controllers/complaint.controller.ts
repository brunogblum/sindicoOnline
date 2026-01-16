import { Controller, Post, Get, Body, Inject, UseGuards, Req, BadRequestException, Param, Query, Patch, UseInterceptors } from '@nestjs/common';
import { COMPLAINTS_TOKENS } from '../../4-infrastructure/di/complaints.tokens';
import { CreateComplaintUseCase } from '../../2-application/use-cases/create-complaint.usecase';
import { ListComplaintsUseCase } from '../../2-application/use-cases/list-complaints.usecase';
import { UploadEvidenceUseCase } from '../../2-application/use-cases/upload-evidence.usecase';
import { UpdateComplaintStatusUseCase } from '../../2-application/use-cases/update-complaint-status.usecase';
import { GetComplaintByIdUseCase } from '../../2-application/use-cases/get-complaint-by-id.usecase';
import { CreateComplaintRequestDto } from '../api-dto/create-complaint-request.dto';
import { ComplaintOwnResponseDto } from '../api-dto/complaint-own-response.dto';
import { ComplaintFullResponseDto } from '../api-dto/complaint-full-response.dto';
import { ComplaintLimitedResponseDto } from '../api-dto/complaint-limited-response.dto';
import { ListComplaintsQueryDto } from '../api-dto/list-complaints-query.dto';
import { UpdateComplaintStatusRequestDto } from '../api-dto/update-complaint-status-request.dto';
import { UpdateComplaintStatusResponseDto } from '../api-dto/update-complaint-status-response.dto';
import { JwtAuthGuard } from '../../../auth/3-interface-adapters/guards/jwt-auth.guard';
import { UploadFiles } from '../../../shared/upload/upload.module';
import { AuditInterceptor } from '../middleware/audit.interceptor';
import { ComplaintFilters, ComplaintPaginationParams } from '../../1-domain/contracts/complaint.repository.contract';
import { ComplaintStatus } from '../../1-domain/value-objects/complaint-status.value-object';
import { ComplaintCategory } from '../../1-domain/value-objects/complaint-category.value-object';
import { ComplaintUrgency } from '../../1-domain/value-objects/complaint-urgency.value-object';

/**
 * Controller para operações de reclamações
 * Endpoints: POST /complaints, GET /complaints
 */
@Controller('complaints')
@UseInterceptors(AuditInterceptor)
export class ComplaintController {
  constructor(
    @Inject(COMPLAINTS_TOKENS.CREATE_COMPLAINT_USECASE)
    private readonly createComplaintUseCase: CreateComplaintUseCase,
    @Inject(COMPLAINTS_TOKENS.LIST_COMPLAINTS_USECASE)
    private readonly listComplaintsUseCase: ListComplaintsUseCase,
    @Inject(COMPLAINTS_TOKENS.UPLOAD_EVIDENCE_USECASE)
    private readonly uploadEvidenceUseCase: UploadEvidenceUseCase,
    @Inject(COMPLAINTS_TOKENS.UPDATE_COMPLAINT_STATUS_USECASE)
    private readonly updateComplaintStatusUseCase: UpdateComplaintStatusUseCase,
    @Inject(COMPLAINTS_TOKENS.GET_COMPLAINT_BY_ID_USECASE)
    private readonly getComplaintByIdUseCase: GetComplaintByIdUseCase,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateComplaintRequestDto,
    @Req() req: any
  ): Promise<ComplaintOwnResponseDto> {
    // Extrai o ID do usuário do token JWT
    const authorId = req.user?.id;
    if (!authorId) {
      throw new BadRequestException('Usuário não autenticado');
    }

    const result = await this.createComplaintUseCase.execute({
      authorId,
      category: dto.category,
      description: dto.description,
      urgency: dto.urgency,
      isAnonymous: dto.isAnonymous || false,
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    const complaint = result.getValue();
    return {
      id: complaint.id,
      category: complaint.category,
      description: complaint.description,
      urgency: complaint.urgency,
      status: complaint.status,
      isAnonymous: complaint.isAnonymous,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(
    @Query() query: ListComplaintsQueryDto,
    @Req() req: any
  ): Promise<{
    complaints: ComplaintFullResponseDto[] | ComplaintLimitedResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    // Extrai dados do usuário do token JWT
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      throw new BadRequestException('Usuário não autenticado ou dados inválidos');
    }

    // Converte query parameters para tipos do domínio
    const pagination: ComplaintPaginationParams = {
      page: query.page || 1,
      limit: query.limit || 50
    };

    const filters: ComplaintFilters = {};

    if (query.status) {
      const statusResult = ComplaintStatus.create(query.status as any);
      if (statusResult.isSuccess) filters.status = statusResult.getValue();
    }

    if (query.category) {
      const categoryResult = ComplaintCategory.create(query.category as any);
      if (categoryResult.isSuccess) filters.category = categoryResult.getValue();
    }

    if (query.urgency) {
      const urgencyResult = ComplaintUrgency.create(query.urgency as any);
      if (urgencyResult.isSuccess) filters.urgency = urgencyResult.getValue();
    }

    if (query.dateFrom) filters.dateFrom = new Date(query.dateFrom);
    if (query.dateTo) filters.dateTo = new Date(query.dateTo);

    const result = await this.listComplaintsUseCase.execute({
      userId,
      userRole,
      pagination,
      filters,
      includeDeleted: query.includeDeleted
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    const data = result.getValue();
    return {
      complaints: data.complaints,
      pagination: data.pagination
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(
    @Param('id') id: string,
    @Req() req: any
  ): Promise<any> {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      throw new BadRequestException('Usuário não autenticado');
    }

    const result = await this.getComplaintByIdUseCase.execute({
      complaintId: id,
      userId,
      userRole
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return result.getValue();
  }

  @Post(':id/evidences')
  @UseGuards(JwtAuthGuard)
  @UploadFiles('evidences', 5) // Máximo 5 arquivos por upload
  async uploadEvidences(
    @Param('id') complaintId: string,
    @Req() req: any
  ): Promise<{ message: string; evidences: any[] }> {
    // Valida se o ID da reclamação é válido
    if (!complaintId || complaintId.trim().length === 0) {
      throw new BadRequestException('ID da reclamação é obrigatório');
    }

    // Extrai o ID do usuário do token JWT
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('Usuário não autenticado');
    }

    // Verifica se há arquivos enviados
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    // Executa o caso de uso
    const result = await this.uploadEvidenceUseCase.execute({
      complaintId,
      userId,
      files: files.map(file => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        filename: file.filename,
      })),
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    const uploadResult = result.getValue();
    return {
      message: `${uploadResult.totalFiles} arquivo(s) enviado(s) com sucesso`,
      evidences: uploadResult.evidences,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') complaintId: string,
    @Body() dto: UpdateComplaintStatusRequestDto,
    @Req() req: any
  ): Promise<UpdateComplaintStatusResponseDto> {
    // Valida se o ID da reclamação é válido
    if (!complaintId || complaintId.trim().length === 0) {
      throw new BadRequestException('ID da reclamação é obrigatório');
    }

    // Extrai o ID do usuário do token JWT
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('Usuário não autenticado');
    }

    // Converte o status string para Value Object
    const newStatusResult = ComplaintStatus.create(dto.newStatus as unknown as string);
    if (newStatusResult.isFailure) {
      throw new BadRequestException(newStatusResult.error);
    }

    const result = await this.updateComplaintStatusUseCase.execute({
      complaintId,
      newStatus: newStatusResult.getValue(),
      changedBy: userId,
      reason: dto.reason,
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    const updateResult = result.getValue();
    return {
      complaintId: updateResult.complaintId,
      previousStatus: updateResult.previousStatus as any,
      newStatus: updateResult.newStatus as any,
      changedBy: updateResult.changedBy,
      changedAt: updateResult.changedAt,
      reason: updateResult.reason,
    };
  }
}

// Categorias de reclamação
export const ComplaintCategory = {
  INFRAESTRUTURA: 'INFRAESTRUTURA',
  LIMPEZA: 'LIMPEZA',
  SEGURANCA: 'SEGURANCA',
  CONVENIENCIA: 'CONVENIENCIA',
  ADMINISTRATIVO: 'ADMINISTRATIVO',
  OUTROS: 'OUTROS',
} as const;

export type ComplaintCategory = (typeof ComplaintCategory)[keyof typeof ComplaintCategory];

// Urgências de reclamação
export const ComplaintUrgency = {
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA',
} as const;

export type ComplaintUrgency = (typeof ComplaintUrgency)[keyof typeof ComplaintUrgency];

// Status de reclamação
export const ComplaintStatus = {
  PENDENTE: 'PENDENTE',
  EM_ANALISE: 'EM_ANALISE',
  RESOLVIDA: 'RESOLVIDA',
  REJEITADA: 'REJEITADA',
} as const;

export type ComplaintStatus = (typeof ComplaintStatus)[keyof typeof ComplaintStatus];

// Interface base da reclamação
export interface Complaint {
  id: string;
  category: ComplaintCategory;
  description: string;
  urgency: ComplaintUrgency;
  status: ComplaintStatus;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// DTOs de resposta da API

// Visão completa (Admin/Síndico)
export interface ComplaintFullView extends Complaint {
  authorId: string;
  authorName: string;
  authorBlock?: string | null;
  authorApartment?: string | null;
}

// Visão limitada (Morador)
export interface ComplaintLimitedView extends Complaint {
  authorDisplay: string; // "Anônimo" ou nome do autor
}

// Visão própria (do autor)
export interface ComplaintOwnView extends Complaint {}

// DTO para criação de reclamação
export interface CreateComplaintRequest {
  category: ComplaintCategory;
  description: string;
  urgency: ComplaintUrgency;
  isAnonymous?: boolean;
}

// DTO de resposta da criação (visão própria)
export interface CreateComplaintResponse extends ComplaintOwnView {}

// Parâmetros de paginação
export interface PaginationParams {
  page: number;
  limit: number;
}

// Informações de paginação na resposta
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Filtros para listagem de reclamações
export interface ComplaintFilters {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  urgency?: ComplaintUrgency;
  dateFrom?: string; // formato ISO
  dateTo?: string; // formato ISO
}

// Parâmetros de query para listagem
export interface ListComplaintsQuery {
  page?: number;
  limit?: number;
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  urgency?: ComplaintUrgency;
  dateFrom?: string;
  dateTo?: string;
}

// Resposta da listagem com paginação
export interface ListComplaintsResponse {
  complaints: ComplaintFullView[] | ComplaintLimitedView[];
  pagination: PaginationInfo;
}

// DTO para atualização de status da reclamação
export interface UpdateComplaintStatusRequest {
  newStatus: ComplaintStatus;
  reason?: string;
}

// DTO de resposta da atualização de status
export interface UpdateComplaintStatusResponse {
  complaintId: string;
  previousStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

// Labels para exibição em português
export const ComplaintCategoryLabels: Record<ComplaintCategory, string> = {
  [ComplaintCategory.INFRAESTRUTURA]: 'Infraestrutura',
  [ComplaintCategory.LIMPEZA]: 'Limpeza',
  [ComplaintCategory.SEGURANCA]: 'Segurança',
  [ComplaintCategory.CONVENIENCIA]: 'Conveniência',
  [ComplaintCategory.ADMINISTRATIVO]: 'Administrativo',
  [ComplaintCategory.OUTROS]: 'Outros',
};

export const ComplaintUrgencyLabels: Record<ComplaintUrgency, string> = {
  [ComplaintUrgency.BAIXA]: 'Baixa',
  [ComplaintUrgency.MEDIA]: 'Média',
  [ComplaintUrgency.ALTA]: 'Alta',
  [ComplaintUrgency.CRITICA]: 'Crítica',
};

export const ComplaintStatusLabels: Record<ComplaintStatus, string> = {
  [ComplaintStatus.PENDENTE]: 'Pendente',
  [ComplaintStatus.EM_ANALISE]: 'Em Análise',
  [ComplaintStatus.RESOLVIDA]: 'Resolvida',
  [ComplaintStatus.REJEITADA]: 'Rejeitada',
};

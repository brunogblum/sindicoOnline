import type {
  CreateComplaintRequest,
  CreateComplaintResponse,
  ComplaintFullView,
  ComplaintLimitedView,
  ListComplaintsQuery,
  ListComplaintsResponse,
} from '../entities/complaint.types';

/**
 * Contrato para operações de reclamações
 * Define as operações que o serviço de reclamações deve implementar
 */
export interface ComplaintServiceContract {
  /**
   * Cria uma nova reclamação
   * @param complaint - Dados da reclamação a ser criada
   * @returns Promise com resposta da criação
   */
  createComplaint(complaint: CreateComplaintRequest): Promise<CreateComplaintResponse>;

  /**
   * Lista todas as reclamações visíveis para o usuário
   * @returns Promise com lista de reclamações (visão depende da role do usuário)
   */
  listComplaints(): Promise<ComplaintFullView[] | ComplaintLimitedView[]>;

  /**
   * Lista reclamações com filtros e paginação
   * @param query - Parâmetros de query com filtros e paginação
   * @returns Promise com lista paginada de reclamações
   */
  listComplaintsWithFilters(query?: ListComplaintsQuery): Promise<ListComplaintsResponse>;
}

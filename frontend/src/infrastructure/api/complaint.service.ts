import apiClient from './auth-interceptor';
import type {
  CreateComplaintRequest,
  CreateComplaintResponse,
  ComplaintFullView,
  ComplaintLimitedView,
  ListComplaintsQuery,
  ListComplaintsResponse,
  UpdateComplaintStatusRequest,
  UpdateComplaintStatusResponse,
} from '../../domain/entities/complaint.types';

/**
 * Serviço de reclamações - Comunicação com API
 */
export class ComplaintService {
  /**
   * Cria uma nova reclamação
   * @param complaint - Dados da reclamação a ser criada
   * @returns Promise com resposta da criação
   */
  static async createComplaint(
    complaint: CreateComplaintRequest
  ): Promise<CreateComplaintResponse> {
    const response = await apiClient.post<CreateComplaintResponse>('/complaints', complaint);
    return response.data;
  }

  /**
   * Lista todas as reclamações visíveis para o usuário
   * @returns Promise com lista de reclamações (visão depende da role do usuário)
   */
  static async listComplaints(): Promise<ComplaintFullView[] | ComplaintLimitedView[]> {
    const response = await apiClient.get<ComplaintFullView[] | ComplaintLimitedView[]>(
      '/complaints'
    );
    return response.data;
  }

  /**
   * Lista reclamações com filtros e paginação
   * @param query - Parâmetros de query com filtros e paginação
   * @returns Promise com lista paginada de reclamações
   */
  static async listComplaintsWithFilters(query: ListComplaintsQuery = {}): Promise<ListComplaintsResponse> {
    // Constrói os parâmetros de query
    const params = new URLSearchParams();

    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.status) params.append('status', query.status);
    if (query.category) params.append('category', query.category);
    if (query.urgency) params.append('urgency', query.urgency);
    if (query.dateFrom) params.append('dateFrom', query.dateFrom);
    if (query.dateTo) params.append('dateTo', query.dateTo);

    const queryString = params.toString();
    const url = `/complaints${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ListComplaintsResponse>(url);
    return response.data;
  }

  /**
   * Atualiza o status de uma reclamação
   * @param complaintId - ID da reclamação
   * @param data - Dados da atualização de status
   * @returns Promise com resposta da atualização
   */
  static async updateComplaintStatus(
    complaintId: string,
    data: UpdateComplaintStatusRequest
  ): Promise<UpdateComplaintStatusResponse> {
    const response = await apiClient.patch<UpdateComplaintStatusResponse>(
      `/complaints/${complaintId}/status`,
      data
    );
    return response.data;
  }

  /**
   * Busca detalhes de uma reclamação por ID
   * @param complaintId - ID da reclamação
   * @returns Promise com detalhes da reclamação, histórico e comentários
   */
  static async getComplaintById(complaintId: string): Promise<any> {
    const response = await apiClient.get<any>(`/complaints/${complaintId}`);
    return response.data;
  }
}

export default ComplaintService;

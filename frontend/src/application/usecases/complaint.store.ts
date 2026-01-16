import { create } from 'zustand';
import type {
  CreateComplaintRequest,
  CreateComplaintResponse,
  ComplaintFullView,
  ComplaintLimitedView,
  ListComplaintsQuery,
  PaginationInfo,
  UpdateComplaintStatusRequest,
  UpdateComplaintStatusResponse,
} from '../../domain/entities/complaint.types';
import { ComplaintService } from '../../infrastructure/api/complaint.service';

interface ComplaintsState {
  complaints: ComplaintFullView[] | ComplaintLimitedView[];
  pagination: PaginationInfo | null;
  lastCreatedComplaint: CreateComplaintResponse | null;
  lastUpdatedComplaint: UpdateComplaintStatusResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createComplaint: (data: CreateComplaintRequest) => Promise<void>;
  fetchComplaints: () => Promise<void>;
  fetchComplaintsWithFilters: (query?: ListComplaintsQuery) => Promise<void>;
  updateComplaintStatus: (complaintId: string, data: UpdateComplaintStatusRequest) => Promise<void>;
  fetchComplaintById: (complaintId: string) => Promise<any>;
  setLastCreatedComplaint: (complaint: CreateComplaintResponse | null) => void;
  setLastUpdatedComplaint: (complaint: UpdateComplaintStatusResponse | null) => void;
  clearError: () => void;
}

export const useComplaintsStore = create<ComplaintsState>((set) => ({
  complaints: [],
  pagination: null,
  lastCreatedComplaint: null,
  lastUpdatedComplaint: null,
  isLoading: false,
  error: null,

  createComplaint: async (data: CreateComplaintRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newComplaint = await ComplaintService.createComplaint(data);
      set({
        lastCreatedComplaint: newComplaint,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar reclamação';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchComplaints: async () => {
    set({ isLoading: true, error: null });
    try {
      const complaints = await ComplaintService.listComplaints();
      set({ complaints, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar reclamações';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchComplaintsWithFilters: async (query: ListComplaintsQuery = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ComplaintService.listComplaintsWithFilters(query);
      set({
        complaints: response.complaints,
        pagination: response.pagination,
        isLoading: false
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar reclamações';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateComplaintStatus: async (complaintId: string, data: UpdateComplaintStatusRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updateResult = await ComplaintService.updateComplaintStatus(complaintId, data);

      // Atualiza a reclamação na lista local
      // O backend retorna newStatus como { value: "STATUS" }, então extraímos o valor
      const newStatusValue = typeof updateResult.newStatus === 'object' && 'value' in updateResult.newStatus
        ? (updateResult.newStatus as any).value
        : updateResult.newStatus;

      set((state) => ({
        complaints: state.complaints.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, status: newStatusValue }
            : complaint
        ) as any,
        lastUpdatedComplaint: updateResult,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar status da reclamação';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchComplaintById: async (complaintId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await ComplaintService.getComplaintById(complaintId);
      set({ isLoading: false });
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar detalhes da reclamação';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setLastCreatedComplaint: (complaint: CreateComplaintResponse | null) => {
    set({ lastCreatedComplaint: complaint });
  },

  setLastUpdatedComplaint: (complaint: UpdateComplaintStatusResponse | null) => {
    set({ lastUpdatedComplaint: complaint });
  },

  clearError: () => {
    set({ error: null });
  },
}));

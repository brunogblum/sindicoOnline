import type { ComplaintFullView, ComplaintStatus } from '../../../domain/entities/complaint.types';

// Interface para dados organizados do Kanban
export interface KanbanData {
  PENDENTE: ComplaintFullView[];
  EM_ANALISE: ComplaintFullView[];
  RESOLVIDA: ComplaintFullView[];
  REJEITADA: ComplaintFullView[];
}

// Configuração das colunas do Kanban
export interface KanbanColumnConfig {
  id: ComplaintStatus;
  title: string;
  color: string;
  description: string;
}

// Props do KanbanBoard
export interface KanbanBoardProps {
  // Não requer props - usa dados diretamente do store
}

// Props do KanbanColumn
export interface KanbanColumnProps {
  id: ComplaintStatus;
  title: string;
  color: string;
  complaints: ComplaintFullView[];
  onCardClick: (complaint: ComplaintFullView) => void;
}

// Props do ComplaintCard
export interface ComplaintCardProps {
  complaint: ComplaintFullView;
  onClick: () => void;
}

// Props do ComplaintDetailsModal
export interface ComplaintDetailsModalProps {
  complaint: ComplaintFullView | null;
  isOpen: boolean;
  onClose: () => void;
}

// Regras de transição válidas
export const VALID_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  PENDENTE: ['EM_ANALISE', 'REJEITADA'],
  EM_ANALISE: ['RESOLVIDA', 'REJEITADA'],
  RESOLVIDA: [],
  REJEITADA: []
};

// Configuração das colunas
export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    id: 'PENDENTE',
    title: 'Pendente',
    color: '#f59e0b', // Amarelo/Laranja
    description: 'Aguardando análise'
  },
  {
    id: 'EM_ANALISE',
    title: 'Em Análise',
    color: '#3b82f6', // Azul
    description: 'Sendo analisada'
  },
  {
    id: 'RESOLVIDA',
    title: 'Resolvida',
    color: '#10b981', // Verde
    description: 'Concluída com sucesso'
  },
  {
    id: 'REJEITADA',
    title: 'Rejeitada',
    color: '#ef4444', // Vermelho
    description: 'Não será atendida'
  }
];

// Função para validar transição
export function canTransition(from: ComplaintStatus, to: ComplaintStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

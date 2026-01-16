import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../application/usecases/auth.store';
import { useWebSocket } from '../../infrastructure/services/useWebSocket';
import type { CardMovedEvent } from '../../infrastructure/services/websocket.service';
import type { ComplaintFullView } from '../../domain/entities/complaint.types';

// API service (simplified - in real app would be in infrastructure layer)
const api = {
  async getBoardCards(boardId: string) {
    const response = await fetch(`/api/kanban/board/${boardId}/cards`);
    if (!response.ok) throw new Error('Failed to fetch board cards');
    return response.json();
  }
};

// Mapeamento de status para colunas do Kanban
const STATUS_TO_COLUMN = {
  PENDENTE: 'PENDENTE',
  EM_ANALISE: 'EM_ANALISE',
  RESOLVIDA: 'RESOLVIDA',
  REJEITADA: 'REJEITADA',
} as const;

export interface KanbanBoardData {
  PENDENTE: ComplaintFullView[];
  EM_ANALISE: ComplaintFullView[];
  RESOLVIDA: ComplaintFullView[];
  REJEITADA: ComplaintFullView[];
}

export interface KanbanViewModelState {
  boardData: KanbanBoardData;
  isLoading: boolean;
  error: string | null;
  isWebSocketConnected: boolean;
  boardId: string | null;
}

export const useKanbanViewModel = () => {
  const [state, setState] = useState<KanbanViewModelState>({
    boardData: {
      PENDENTE: [],
      EM_ANALISE: [],
      RESOLVIDA: [],
      REJEITADA: [],
    },
    isLoading: true,
    error: null,
    isWebSocketConnected: false,
    boardId: null,
  });

  const authStore = useAuthStore.getState();
  const userId = authStore.user?.id;
  const userRole = authStore.user?.role;

  // WebSocket para atualizações em tempo real
  const { isConnected: isWebSocketConnected, moveCard: wsMoveCard } = useWebSocket({
    boardId: state.boardId || undefined,
    userId: userId || undefined,
    userRole: userRole || undefined,
    onCardMoved: handleCardMoved,
    onConnected: () => setState(prev => ({ ...prev, isWebSocketConnected: true })),
    onDisconnected: () => setState(prev => ({ ...prev, isWebSocketConnected: false })),
    onError: (error) => {
      // Não definir erro para não quebrar a UI se WebSocket falhar
      console.warn('WebSocket error:', error.message);
      setState(prev => ({ ...prev, isWebSocketConnected: false }));
    },
  });

  // Carregar dados iniciais via REST
  const loadInitialData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Buscar dados do board via API
      const boardId = 'default-board'; // TODO: Obter dinamicamente

      try {
        const boardCards = await api.getBoardCards(boardId);

      // Organizar cards por coluna
      const newBoardData: KanbanBoardData = {
        PENDENTE: [],
        EM_ANALISE: [],
        RESOLVIDA: [],
        REJEITADA: [],
      };

      // Mapear dados da API para o formato local
      Object.entries(boardCards).forEach(([columnId, cards]) => {
        const cardArray = cards as any[];
        // Mapear columnId para status (baseado no nome da coluna)
        let statusKey: keyof KanbanBoardData;
        if (columnId.includes('Pendente') || columnId.includes('PENDENTE')) {
          statusKey = 'PENDENTE';
        } else if (columnId.includes('Análise') || columnId.includes('EM_ANALISE')) {
          statusKey = 'EM_ANALISE';
        } else if (columnId.includes('Resolvida') || columnId.includes('RESOLVIDA')) {
          statusKey = 'RESOLVIDA';
        } else if (columnId.includes('Rejeitada') || columnId.includes('REJEITADA')) {
          statusKey = 'REJEITADA';
        } else {
          return; // Coluna desconhecida
        }

        // Converter cards da API para o formato ComplaintFullView
        const complaintCards: ComplaintFullView[] = cardArray.map((card: any) => ({
          id: card.complaintId || card.id,
          description: card.description || card.title,
          status: statusKey,
          category: 'INFRAESTRUTURA', // TODO: Obter da reclamação real
          urgency: 'MEDIA', // TODO: Obter da reclamação real
          isAnonymous: false, // TODO: Obter da reclamação real
          authorName: 'Usuário', // TODO: Obter da reclamação real
          authorId: 'user-id', // TODO: Obter da reclamação real
          createdAt: card.createdAt || new Date().toISOString(),
          updatedAt: card.updatedAt || new Date().toISOString(),
          evidences: [], // TODO: Obter evidências da reclamação real
        }));

        newBoardData[statusKey] = complaintCards.sort((a, b) => {
          // Ordenar por ordem do card (se disponível) ou por data de criação
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
      });

        setState(prev => ({
          ...prev,
          boardData: newBoardData,
          isLoading: false,
          boardId,
        }));
      } catch (apiError) {
        console.warn('API não disponível, usando dados mock:', apiError);
        // Usar dados mock se a API não estiver disponível
        const mockBoardData: KanbanBoardData = {
          PENDENTE: [],
          EM_ANALISE: [],
          RESOLVIDA: [],
          REJEITADA: [],
        };

        setState(prev => ({
          ...prev,
          boardData: mockBoardData,
          isLoading: false,
          boardId,
          error: null, // Não mostrar erro para não quebrar a UI
        }));
      }
    } catch (error: any) {
      console.error('Erro geral ao carregar dados do Kanban:', error);
      // Mesmo em caso de erro geral, manter a UI funcional
      setState(prev => ({
        ...prev,
        boardData: {
          PENDENTE: [],
          EM_ANALISE: [],
          RESOLVIDA: [],
          REJEITADA: [],
        },
        isLoading: false,
        error: null, // Não mostrar erro
      }));
    }
  }, []);

  // Handler para eventos WebSocket de movimento de card
  function handleCardMoved(_event: CardMovedEvent) {
    setState(prev => {
      const newBoardData = { ...prev.boardData };

      // Se o card foi movido por outro usuário, atualizar o estado local
      // TODO: Implementar lógica para atualizar o estado baseado no evento

      return {
        ...prev,
        boardData: newBoardData,
      };
    });
  }

  // Método para mover card (combina WebSocket + fallback REST)
  const moveCard = useCallback(async (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex: number
  ) => {
    if (!state.boardId) return;

    try {
      setState(prev => ({ ...prev, error: null }));

      // Otimistic update: atualizar UI imediatamente
      setState(prev => {
        const newBoardData = { ...prev.boardData };
        const fromColumn = fromColumnId as keyof KanbanBoardData;
        const toColumn = toColumnId as keyof KanbanBoardData;

        // Encontrar e remover card da coluna origem
        const cardIndex = newBoardData[fromColumn].findIndex(c => c.id === cardId);
        if (cardIndex === -1) return prev;

        const [movedCard] = newBoardData[fromColumn].splice(cardIndex, 1);

        // Inserir na nova posição da coluna destino
        newBoardData[toColumn].splice(newIndex, 0, movedCard);

        return {
          ...prev,
          boardData: newBoardData,
        };
      });

      // Enviar via WebSocket
      wsMoveCard(cardId, fromColumnId, toColumnId, newIndex, state.boardId);

      // TODO: Fallback para REST se WebSocket falhar

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao mover card',
      }));

      // Reverter otimistic update em caso de erro
      await loadInitialData();
    }
  }, [state.boardId, wsMoveCard, loadInitialData]);

  // Atualizar dados quando reclamações mudam (integração com ComplaintFeedViewModel)
  const updateFromComplaints = useCallback((complaints: ComplaintFullView[]) => {
    const newBoardData: KanbanBoardData = {
      PENDENTE: [],
      EM_ANALISE: [],
      RESOLVIDA: [],
      REJEITADA: [],
    };

    // Organizar reclamações por status
    for (const complaint of complaints) {
      const columnKey = STATUS_TO_COLUMN[complaint.status] as keyof KanbanBoardData;
      if (columnKey in newBoardData) {
        newBoardData[columnKey].push(complaint);
      }
    }

    setState(prev => ({
      ...prev,
      boardData: newBoardData,
      isLoading: false,
    }));
  }, []);

  // Efeitos
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    setState(prev => ({ ...prev, isWebSocketConnected }));
  }, [isWebSocketConnected]);

  // Getters
  const totalCards = Object.values(state.boardData).reduce((sum, cards) => sum + cards.length, 0);

  return {
    // Estado
    ...state,
    totalCards,

    // Ações
    moveCard,
    updateFromComplaints,
    refresh: loadInitialData,
    clearError: () => setState(prev => ({ ...prev, error: null })),
  };
};

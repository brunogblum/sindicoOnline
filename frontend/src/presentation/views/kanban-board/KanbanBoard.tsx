import React, { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import type { ComplaintFullView, ComplaintStatus } from '../../../domain/entities/complaint.types';
import type { KanbanBoardProps } from './types';
import { KANBAN_COLUMNS, canTransition } from './types';
import { KanbanColumn } from './KanbanColumn';
import { ComplaintCard } from './ComplaintCard';
import { ComplaintDetailsModal } from './ComplaintDetailsModal';
import { useKanbanViewModel, type KanbanBoardData } from '../../viewmodels/kanban.view-model';
import { useComplaintsStore } from '../../../application/usecases/complaint.store';

// Mapeamento de status para colunas do Kanban
const STATUS_TO_COLUMN = {
  PENDENTE: 'PENDENTE',
  EM_ANALISE: 'EM_ANALISE',
  RESOLVIDA: 'RESOLVIDA',
  REJEITADA: 'REJEITADA',
} as const;
import './kanban-board.css';

export const KanbanBoard: React.FC<KanbanBoardProps> = () => {
  const [activeComplaint, setActiveComplaint] = useState<ComplaintFullView | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintFullView | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Usar o KanbanViewModel apenas para WebSocket
  const kanbanVM = useKanbanViewModel();

  // Usar dados diretamente do store (mais confiável que o viewModel)
  const complaintsStore = useComplaintsStore();
  const complaints = complaintsStore.complaints as ComplaintFullView[];
  const isLoading = complaintsStore.isLoading;
  const error = complaintsStore.error;

  // Organizar reclamações por status (baseado nos dados do store)
  const boardData: KanbanBoardData = React.useMemo(() => {
    const data: KanbanBoardData = {
      PENDENTE: [],
      EM_ANALISE: [],
      RESOLVIDA: [],
      REJEITADA: [],
    };

    if (complaints && complaints.length > 0) {
      for (const complaint of complaints) {
        const status = complaint.status as keyof typeof STATUS_TO_COLUMN;
        const columnKey = STATUS_TO_COLUMN[status] as keyof KanbanBoardData;
        if (columnKey in data) {
          data[columnKey].push(complaint);
    }
      }
    }

    return data;
  }, [complaints]);

  // Calcular total de cards
  const totalCards = Object.values(boardData).reduce((sum, cards) => sum + cards.length, 0);

  // Verificar se devemos mostrar estado vazio
  const isEmpty = !isLoading && !error && totalCards === 0;

  // Função para mover card no kanban (memoizada)
  const moveKanbanCard = useCallback(async (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    try {
      // Atualização otimista: atualizar complaintsStore imediatamente
      complaintsStore.updateComplaintStatus(cardId, {
        newStatus: toColumnId as any,
      });

      // Enviar movimento via WebSocket
      await kanbanVM.moveCard(cardId, fromColumnId, toColumnId, newIndex);
      console.log('Card movido com sucesso:', { cardId, fromColumnId, toColumnId, newIndex });
    } catch (err: any) {
      console.error('Erro ao mover card:', err);
      // Reverter atualização otimista em caso de erro
      complaintsStore.updateComplaintStatus(cardId, {
        newStatus: fromColumnId as any,
      });
      throw err; // Re-throw para que o drag possa ser revertido
    }
  }, [kanbanVM, complaintsStore]);

  // Handler para início do drag (memoizado)
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const complaint = active.data.current?.complaint;
    setActiveComplaint(complaint);
  }, []);

  // Handler para fim do drag (memoizado)
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setActiveComplaint(null);

    if (!over) return;

    const complaintId = active.id as string;
    const overId = over.id as string;
    const complaint = active.data.current?.complaint;

    if (!complaint) return;

    // Determinar coluna de origem baseada no status atual
    const fromColumnId = complaint.status;

    // Determinar coluna de destino
    // Se over.id é um status (coluna), usar diretamente
    // Se over.id é um card ID, encontrar qual coluna contém esse card
    let toColumnId: string = '';
    let newIndex: number = 0;

    const statusColumns = Object.keys(boardData) as ComplaintStatus[];
    if (statusColumns.includes(overId as ComplaintStatus)) {
      // Soltou sobre uma coluna
      toColumnId = overId;
      const targetColumn = boardData[toColumnId as keyof typeof boardData];
      newIndex = targetColumn ? targetColumn.length : 0;
    } else {
      // Soltou sobre um card - encontrar a coluna que contém esse card
      for (const [columnId, cards] of Object.entries(boardData)) {
        const cardIndex = cards.findIndex((c: ComplaintFullView) => c.id === overId);
        if (cardIndex !== -1) {
          toColumnId = columnId;
          // Inserir na posição do card encontrado
          newIndex = cardIndex;
          break;
        }
      }

      // Se não encontrou o card, usar a coluna de origem como fallback
      if (!toColumnId) {
        console.warn('Card destino não encontrado, cancelando movimento');
        return;
      }
    }

    // Validar transição usando as regras existentes
    const newStatus = toColumnId as ComplaintStatus;
    if (!canTransition(complaint.status, newStatus)) {
      kanbanVM.clearError();
      // Temporário - depois implementar notificação de erro
      console.warn(`Transição inválida: ${complaint.status} → ${newStatus}`);
      return;
    }

    // Mover card via WebSocket
    moveKanbanCard(complaintId, fromColumnId, toColumnId, newIndex).catch(() => {
      // Erro já foi tratado no ViewModel
    });
  }, [kanbanVM, moveKanbanCard]);

  // Handler para clique no card (memoizado)
  const handleCardClick = useCallback((complaint: ComplaintFullView) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  }, []);

  // Memoizar sensors para evitar re-criações
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Memoizar callbacks para DndContext
  const dndContextValue = useMemo(() => ({
    sensors,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  }), [sensors, handleDragStart, handleDragEnd]);

  // Memoizar colunas para evitar re-renders
  const renderedColumns = useMemo(() => (
    KANBAN_COLUMNS.map((column) => (
      <KanbanColumn
        key={column.id}
        id={column.id}
        title={column.title}
        color={column.color}
        complaints={boardData[column.id as keyof typeof boardData] || []}
        onCardClick={handleCardClick}
      />
    ))
  ), [boardData, handleCardClick]);

  // Handler para fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };


  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="kanban-board-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', margin: 0 }}>Carregando reclamações...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Estado vazio
  if (isEmpty) {
    return (
      <div className="kanban-board-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ fontSize: '3rem', opacity: 0.5 }}>📋</div>
          <h3 style={{ color: '#6b7280', margin: 0 }}>Nenhuma reclamação encontrada</h3>
          <p style={{ color: '#9ca3af', textAlign: 'center', margin: 0 }}>
            Não há reclamações para exibir no momento.<br />
            As reclamações aparecerão aqui quando forem criadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-board-container">
      <div className="kanban-board-header">
        <h1>Board Kanban - Reclamações</h1>
        <div className="kanban-board-stats">
          <span>Total: {totalCards}</span>
          {kanbanVM.isWebSocketConnected && (
            <span className="websocket-status connected">🟢 Tempo Real</span>
          )}
          {!kanbanVM.isWebSocketConnected && (
            <span className="websocket-status disconnected">🔴 Offline</span>
          )}
        </div>
      </div>

      {(kanbanVM.error || error) && (
        <div className="kanban-error-message">
          ⚠️ {kanbanVM.error || error}
        </div>
      )}

      <DndContext {...dndContextValue}>
        <div className="kanban-board">
          {renderedColumns}
        </div>

        {activeComplaint && (
          <DragOverlay>
            <ComplaintCard
              complaint={activeComplaint}
              onClick={() => {}} // Não faz nada durante drag
            />
          </DragOverlay>
        )}
      </DndContext>

      <ComplaintDetailsModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

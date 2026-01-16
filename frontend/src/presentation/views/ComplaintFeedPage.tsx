import React, { useState, useEffect } from 'react';
import { ComplaintFeed } from './complaint-feed';
import { KanbanBoard } from './kanban-board/KanbanBoard';
import useAuth from '../../application/usecases/useAuth';
import { useComplaintsStore } from '../../application/usecases/complaint.store';

/**
 * Página do Feed de Reclamações
 * Ponto de entrada para o feed de reclamações com MVVM
 * Suporte a visualizações: Lista e Kanban
 */
const ComplaintFeedPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const complaintsStore = useComplaintsStore();

  // Verificar se o usuário pode acessar o Kanban (Síndico ou Admin)
  const canAccessKanban = ['SINDICO', 'ADMIN'].includes(user?.role || '');

  // Garantir que os dados sejam carregados independente da visualização
  useEffect(() => {
    // Carregar reclamações apenas uma vez quando o componente montar
    if (complaintsStore.complaints.length === 0 && !complaintsStore.isLoading) {
      complaintsStore.fetchComplaintsWithFilters({ page: 1, limit: 50 });
    }
  }, []); // Removida dependência para evitar loops

  // Se usuário não pode acessar Kanban, forçar visualização lista
  useEffect(() => {
    if (!canAccessKanban && viewMode === 'kanban') {
      setViewMode('list');
    }
  }, [canAccessKanban, viewMode]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header com seletor de visualização */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e9ecef',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ margin: 0, color: '#495057' }}>Reclamações</h2>

          {canAccessKanban && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '8px 16px',
                  border: viewMode === 'list' ? '2px solid #007bff' : '1px solid #dee2e6',
                  backgroundColor: viewMode === 'list' ? '#e7f3ff' : 'white',
                  color: viewMode === 'list' ? '#007bff' : '#6c757d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: viewMode === 'list' ? '600' : '400'
                }}
              >
                📋 Lista
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                style={{
                  padding: '8px 16px',
                  border: viewMode === 'kanban' ? '2px solid #007bff' : '1px solid #dee2e6',
                  backgroundColor: viewMode === 'kanban' ? '#e7f3ff' : 'white',
                  color: viewMode === 'kanban' ? '#007bff' : '#6c757d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: viewMode === 'kanban' ? '600' : '400'
                }}
              >
                📊 Kanban
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo da visualização selecionada */}
      {viewMode === 'list' ? (
        <ComplaintFeed />
      ) : (
        <div style={{ padding: '24px' }}>
          <KanbanBoard />
        </div>
      )}
    </div>
  );
};

export default ComplaintFeedPage;



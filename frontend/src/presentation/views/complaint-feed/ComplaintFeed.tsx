import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaintsStore } from '../../../application/usecases/complaint.store';
import type {
  ComplaintFullView,
  ComplaintLimitedView,
  ComplaintStatus,
} from '../../../domain/entities/complaint.types';
import {
  ComplaintStatusLabels,
  ComplaintCategoryLabels,
  ComplaintUrgencyLabels
} from '../../../domain/entities/complaint.types';
import './complaint-feed.css';

/**
 * Propriedades do componente ComplaintFeed
 */
interface ComplaintFeedProps {
  // Não requer props - usa dados diretamente do store
}

/**
 * Componente de feed de reclamações
 * Exibe lista de cards minimalistas com filtro de status discreto
 */
export const ComplaintFeed: React.FC<ComplaintFeedProps> = () => {
  const complaintsStore = useComplaintsStore();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | ''>('');

  // Dados do store
  const complaints = complaintsStore.complaints;
  const pagination = complaintsStore.pagination;
  const isLoading = complaintsStore.isLoading;
  const error = complaintsStore.error;

  // Handler para filtro de status
  const handleStatusChange = async (status: ComplaintStatus | '') => {
    setSelectedStatus(status);
    await complaintsStore.fetchComplaintsWithFilters({
      page: 1,
      limit: 50,
      status: status || undefined
    });
  };

  const handleCardClick = (complaintId: string) => {
    navigate(`/complaints/${complaintId}`);
  };

  // Renderiza uma reclamação individual como um card minimalista
  const renderComplaint = (complaint: ComplaintFullView | ComplaintLimitedView) => {
    return (
      <div
        key={complaint.id}
        className="complaint-card minimalist"
        onClick={() => handleCardClick(complaint.id)}
      >
        <div className="card-top">
          <span className="complaint-id">#{complaint.id.substring(0, 8)}</span>
          <span className={`status-dot status-${complaint.status.toLowerCase()}`}></span>
          <span className={`status-text status-${complaint.status.toLowerCase()}`}>
            {ComplaintStatusLabels[complaint.status]}
          </span>
        </div>

        <div className="card-content">
          <p className="complaint-description">
            {complaint.description.length > 150
              ? `${complaint.description.substring(0, 150)}...`
              : complaint.description}
          </p>
        </div>

        <div className="card-bottom">
          <div className="card-tags">
            <span className="tag category">
              {ComplaintCategoryLabels[complaint.category]}
            </span>
            <span className={`tag urgency urgency-${complaint.urgency.toLowerCase()}`}>
              {ComplaintUrgencyLabels[complaint.urgency]}
            </span>
          </div>
          <div className="card-date">
            {new Date(complaint.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="complaint-feed-modern">
      <div className="feed-header-modern">
        <div className="status-filters-discrete">
          <button
            className={selectedStatus === '' ? 'active' : ''}
            onClick={() => handleStatusChange('')}
          >
            Todas
          </button>
          {Object.entries(ComplaintStatusLabels).map(([key, label]) => (
            <button
              key={key}
              className={selectedStatus === key ? 'active' : ''}
              onClick={() => handleStatusChange(key as ComplaintStatus)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="complaints-grid">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => complaintsStore.clearError()}>×</button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="shimmer-card"></div>
            <div className="shimmer-card"></div>
            <div className="shimmer-card"></div>
          </div>
        ) : (
          <>
            <div className="grid-container">
              {complaints.length === 0 ? (
                <div className="empty-state-modern">
                  <div className="empty-icon">📂</div>
                  <h3>Nenhuma reclamação</h3>
                  <p>Não encontramos nenhuma reclamação com os filtros selecionados.</p>
                </div>
              ) : (
                complaints.map(renderComplaint)
              )}
            </div>

            {/* Paginação */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination-modern">
                <button
                  onClick={() => complaintsStore.fetchComplaintsWithFilters({
                    page: (pagination?.page || 1) - 1,
                    limit: 50,
                    status: selectedStatus || undefined
                  })}
                  disabled={!(pagination && pagination.page > 1) || isLoading}
                >
                  ←
                </button>

                <span className="page-info">
                  {pagination?.page} / {pagination?.totalPages}
                </span>

                <button
                  onClick={() => complaintsStore.fetchComplaintsWithFilters({
                    page: (pagination?.page || 1) + 1,
                    limit: 50,
                    status: selectedStatus || undefined
                  })}
                  disabled={!(pagination && pagination.page < pagination.totalPages) || isLoading}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

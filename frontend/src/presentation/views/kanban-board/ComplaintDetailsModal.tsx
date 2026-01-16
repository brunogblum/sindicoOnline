import React from 'react';
import { ComplaintCategoryLabels, ComplaintUrgencyLabels, ComplaintStatusLabels } from '../../../domain/entities/complaint.types';
import type { ComplaintDetailsModalProps } from './types';
import './kanban-board.css';

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  complaint,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !complaint) return null;

  // Ícones por categoria
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      INFRAESTRUTURA: '🏗️',
      LIMPEZA: '🧹',
      SEGURANCA: '🔒',
      CONVENIENCIA: '🏢',
      ADMINISTRATIVO: '📋',
      OUTROS: '📝',
    };
    return icons[category] || '📝';
  };

  // Ícones por urgência
  const getUrgencyIcon = (urgency: string) => {
    const icons: Record<string, string> = {
      BAIXA: '🟢',
      MEDIA: '🟡',
      ALTA: '🟠',
      CRITICA: '🔴',
    };
    return icons[urgency] || '🟢';
  };

  // Formatar data
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Formatar nome do autor
  const getAuthorDisplay = () => {
    if (complaint.isAnonymous) {
      return 'Anônimo';
    }
    return complaint.authorName;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalhes da Reclamação</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Informações básicas */}
          <div className="complaint-info-section">
            <div className="info-row">
              <div className="info-item">
                <label>Categoria:</label>
                <span className="category-badge">
                  {getCategoryIcon(complaint.category)} {ComplaintCategoryLabels[complaint.category]}
                </span>
              </div>
              <div className="info-item">
                <label>Urgência:</label>
                <span className="urgency-badge">
                  {getUrgencyIcon(complaint.urgency)} {ComplaintUrgencyLabels[complaint.urgency]}
                </span>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span className="status-badge">
                  {ComplaintStatusLabels[complaint.status]}
                </span>
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                <label>Autor:</label>
                <span>{getAuthorDisplay()}</span>
              </div>
              {complaint.authorBlock && complaint.authorApartment && (
                <div className="info-item">
                  <label>Localização:</label>
                  <span>{complaint.authorBlock}, Apt {complaint.authorApartment}</span>
                </div>
              )}
            </div>

            <div className="info-row">
              <div className="info-item">
                <label>Data de Criação:</label>
                <span>{formatDate(complaint.createdAt)}</span>
              </div>
              <div className="info-item">
                <label>Última Atualização:</label>
                <span>{formatDate(complaint.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Descrição completa */}
          <div className="complaint-description-section">
            <h3>Descrição da Reclamação</h3>
            <div className="description-content">
              {complaint.description}
            </div>
          </div>

          {/* Histórico de Status (placeholder) */}
          <div className="complaint-history-section">
            <h3>Histórico de Status</h3>
            <div className="history-placeholder">
              <p>📋 Histórico de alterações em desenvolvimento.</p>
            </div>
          </div>

          {/* Comentários Internos (placeholder) */}
          <div className="internal-comments-section">
            <h3>Comentários Internos</h3>
            <div className="comments-placeholder">
              <p>💬 Sistema de comentários internos em desenvolvimento.</p>
              <p>Esta funcionalidade permitirá que síndicos e administradores adicionem notas privadas sobre as reclamações.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

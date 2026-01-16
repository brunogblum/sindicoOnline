import React, { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComplaintCategoryLabels, ComplaintUrgencyLabels } from '../../../domain/entities/complaint.types';
import type { ComplaintCardProps } from './types';
import './kanban-board.css';

export const ComplaintCard: React.FC<ComplaintCardProps> = React.memo(({ complaint, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: complaint.id,
    data: {
      type: 'complaint',
      complaint,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Valores memoizados para melhor performance
  const categoryIcon = useMemo(() => {
    const icons: Record<string, string> = {
      INFRAESTRUTURA: '🏗️',
      LIMPEZA: '🧹',
      SEGURANCA: '🔒',
      CONVENIENCIA: '🏢',
      ADMINISTRATIVO: '📋',
      OUTROS: '📝',
    };
    return icons[complaint.category] || '📝';
  }, [complaint.category]);

  const urgencyIcon = useMemo(() => {
    const icons: Record<string, string> = {
      BAIXA: '🟢',
      MEDIA: '🟡',
      ALTA: '🟠',
      CRITICA: '🔴',
    };
    return icons[complaint.urgency] || '🟢';
  }, [complaint.urgency]);

  const formattedDate = useMemo(() => {
    return new Date(complaint.createdAt).toLocaleDateString('pt-BR');
  }, [complaint.createdAt]);

  const truncatedDescription = useMemo(() => {
    const maxLength = 80;
    if (complaint.description.length <= maxLength) return complaint.description;
    return complaint.description.substring(0, maxLength) + '...';
  }, [complaint.description]);

  const authorDisplay = useMemo(() => {
    if (complaint.isAnonymous) {
      return '👤 Anônimo';
    }
    return `👤 ${complaint.authorName}`;
  }, [complaint.isAnonymous, complaint.authorName]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="complaint-card"
      {...attributes}
      {...listeners}
    >
      {/* Handle de drag separado */}
      <div className="complaint-card-drag-handle" {...listeners}>
        <div className="complaint-card-header">
          <div className="complaint-card-category">
            {categoryIcon} {ComplaintCategoryLabels[complaint.category]}
          </div>
          <div className="complaint-card-urgency">
            {urgencyIcon} {ComplaintUrgencyLabels[complaint.urgency]}
          </div>
        </div>
      </div>

      {/* Conteúdo clicável */}
      <div className="complaint-card-content" onClick={onClick}>
        <div className="complaint-card-description">
          {truncatedDescription}
        </div>

        <div className="complaint-card-footer">
          <div className="complaint-card-author">
            {authorDisplay}
            {complaint.authorBlock && complaint.authorApartment && (
              <span className="complaint-card-location">
                - {complaint.authorBlock}, Apt {complaint.authorApartment}
              </span>
            )}
          </div>
          <div className="complaint-card-date">
            📅 {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
});

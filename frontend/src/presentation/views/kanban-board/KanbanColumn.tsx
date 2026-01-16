import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { KanbanColumnProps } from './types';
import { ComplaintCard } from './ComplaintCard';
import './kanban-board.css';

export const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({
  id,
  title,
  color,
  complaints,
  onCardClick,
}) => {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id,
  });

  const style = {
    borderColor: isOver ? color : '#e5e7eb',
    borderWidth: isOver ? '2px' : '1px',
  };

  // Memoizar lista de IDs para SortableContext
  const complaintIds = useMemo(() => complaints.map(c => c.id), [complaints]);

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={style}
    >
      <div className="kanban-column-header">
        <div
          className="kanban-column-title"
          style={{ backgroundColor: color }}
        >
          <h3>{title}</h3>
          <span className="kanban-column-count">({complaints.length})</span>
        </div>
      </div>

      <div className="kanban-column-content">
        <SortableContext
          items={complaintIds}
          strategy={verticalListSortingStrategy}
        >
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onClick={() => onCardClick(complaint)}
            />
          ))}
        </SortableContext>

        {complaints.length === 0 && (
          <div className="kanban-column-empty">
            <div className="kanban-column-empty-icon">📋</div>
            <div className="kanban-column-empty-text">
              Nenhuma reclamação
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

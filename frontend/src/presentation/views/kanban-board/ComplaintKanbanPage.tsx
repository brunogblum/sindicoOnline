import React from 'react';
import { KanbanBoard } from './KanbanBoard';
import './kanban-board.css';

const ComplaintKanbanPage: React.FC = () => {
  return (
    <div className="complaint-kanban-page">
      <KanbanBoard />
    </div>
  );
};

export default ComplaintKanbanPage;


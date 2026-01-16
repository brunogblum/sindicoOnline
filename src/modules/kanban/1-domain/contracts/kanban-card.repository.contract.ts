import { KanbanCard } from '../entities/kanban-card.entity';

export interface IKanbanCardRepository {
  create(card: KanbanCard): Promise<KanbanCard>;
  findById(id: string): Promise<KanbanCard | null>;
  findByBoardId(boardId: string): Promise<KanbanCard[]>;
  findByColumnId(columnId: string): Promise<KanbanCard[]>;
  findByComplaintId(complaintId: string): Promise<KanbanCard | null>;
  update(card: KanbanCard): Promise<KanbanCard>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  moveCard(cardId: string, columnId: string, newOrder: number): Promise<void>;
  updateOrdersInColumn(columnId: string, cards: { id: string; order: number }[]): Promise<void>;
}



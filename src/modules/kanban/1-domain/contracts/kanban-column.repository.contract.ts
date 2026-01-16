import { KanbanColumn } from '../entities/kanban-column.entity';

export interface IKanbanColumnRepository {
  create(column: KanbanColumn): Promise<KanbanColumn>;
  findById(id: string): Promise<KanbanColumn | null>;
  findByBoardId(boardId: string): Promise<KanbanColumn[]>;
  update(column: KanbanColumn): Promise<KanbanColumn>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  updateOrders(columns: { id: string; order: number }[]): Promise<void>;
}



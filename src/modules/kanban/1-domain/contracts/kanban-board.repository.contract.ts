import { KanbanBoard } from '../entities/kanban-board.entity';

export interface IKanbanBoardRepository {
  create(board: KanbanBoard): Promise<KanbanBoard>;
  findById(id: string): Promise<KanbanBoard | null>;
  findAll(): Promise<KanbanBoard[]>;
  update(board: KanbanBoard): Promise<KanbanBoard>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}



import { KanbanBoard } from '../../1-domain';

export interface CreateBoardDto {
  title?: string;
}

export interface BoardWithColumnsDto {
  board: KanbanBoard;
  columns: ColumnWithCardsDto[];
}

export interface ColumnWithCardsDto {
  id: string;
  title: string;
  order: number;
  cards: CardDto[];
}

export interface CardDto {
  id: string;
  title: string;
  description?: string;
  order: number;
  complaintId?: string;
}



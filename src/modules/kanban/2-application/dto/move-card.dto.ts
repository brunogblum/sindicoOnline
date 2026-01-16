export interface MoveCardDto {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  newIndex: number;
  boardId: string;
}

export interface MoveCardResponseDto {
  success: boolean;
  cardId: string;
  newColumnId: string;
  newOrder: number;
  movedAt: Date;
}



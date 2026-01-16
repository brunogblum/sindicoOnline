import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IKanbanBoardRepository, IKanbanColumnRepository, IKanbanCardRepository } from '../../1-domain';
import { KANBAN_TOKENS } from '../../4-infrastructure';
import { BoardWithColumnsDto } from '../dto/board.dto';

@Injectable()
export class GetBoardUseCase {
  constructor(
    @Inject(KANBAN_TOKENS.KANBAN_BOARD_REPOSITORY)
    private readonly boardRepository: IKanbanBoardRepository,
    @Inject(KANBAN_TOKENS.KANBAN_COLUMN_REPOSITORY)
    private readonly columnRepository: IKanbanColumnRepository,
    @Inject(KANBAN_TOKENS.KANBAN_CARD_REPOSITORY)
    private readonly cardRepository: IKanbanCardRepository,
  ) {}

  async execute(boardId: string): Promise<BoardWithColumnsDto> {
    // Buscar o board
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException(`Board com ID ${boardId} não encontrado`);
    }

    // Buscar colunas do board
    const columns = await this.columnRepository.findByBoardId(boardId);
    const sortedColumns = columns.sort((a, b) => a.order - b.order);

    // Para cada coluna, buscar os cards
    const columnsWithCards = await Promise.all(
      sortedColumns.map(async (column) => {
        const cards = await this.cardRepository.findByColumnId(column.id);
        const sortedCards = cards.sort((a, b) => a.order - b.order);

        return {
          id: column.id,
          title: column.title,
          order: column.order,
          cards: sortedCards.map(card => ({
            id: card.id,
            title: card.title,
            description: card.description,
            order: card.order,
            complaintId: card.complaintId,
          })),
        };
      })
    );

    return {
      board,
      columns: columnsWithCards,
    };
  }
}

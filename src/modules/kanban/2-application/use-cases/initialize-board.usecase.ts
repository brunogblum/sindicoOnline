import { Injectable, Inject } from '@nestjs/common';
import type { IKanbanBoardRepository, IKanbanColumnRepository, IKanbanCardRepository } from '../../1-domain';
import { KanbanBoard, KanbanColumn } from '../../1-domain';
import { KANBAN_TOKENS } from '../../4-infrastructure';

@Injectable()
export class InitializeBoardUseCase {
  constructor(
    @Inject(KANBAN_TOKENS.KANBAN_BOARD_REPOSITORY)
    private readonly boardRepository: IKanbanBoardRepository,
    @Inject(KANBAN_TOKENS.KANBAN_COLUMN_REPOSITORY)
    private readonly columnRepository: IKanbanColumnRepository,
    @Inject(KANBAN_TOKENS.KANBAN_CARD_REPOSITORY)
    private readonly cardRepository: IKanbanCardRepository,
  ) {}

  async execute(): Promise<string> {
    // Verificar se já existe um board
    const existingBoards = await this.boardRepository.findAll();
    if (existingBoards.length > 0) {
      return existingBoards[0].id;
    }

    // Criar board padrão
    const board = new KanbanBoard(undefined, 'Board de Reclamações');
    const savedBoard = await this.boardRepository.create(board);

    // Criar colunas padrão baseadas nos status das reclamações
    const defaultColumns = [
      { title: 'Pendente', order: 1 },
      { title: 'Em Análise', order: 2 },
      { title: 'Resolvida', order: 3 },
      { title: 'Rejeitada', order: 4 },
    ];

    for (const col of defaultColumns) {
      const column = new KanbanColumn(savedBoard.id, col.title, col.order * 100);
      await this.columnRepository.create(column);
    }

    return savedBoard.id;
  }
}

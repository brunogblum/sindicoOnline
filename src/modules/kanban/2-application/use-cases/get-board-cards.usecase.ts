import { Injectable, Inject } from '@nestjs/common';
import type { IKanbanCardRepository } from '../../1-domain';
import { KANBAN_TOKENS } from '../../4-infrastructure';

@Injectable()
export class GetBoardCardsUseCase {
  constructor(
    @Inject(KANBAN_TOKENS.KANBAN_CARD_REPOSITORY)
    private readonly cardRepository: IKanbanCardRepository,
  ) {}

  async execute(boardId: string) {
    // Buscar todos os cards do board
    const cards = await this.cardRepository.findByBoardId(boardId);

    // Organizar por coluna
    const cardsByColumn: Record<string, any[]> = {};

    for (const card of cards) {
      if (!cardsByColumn[card.columnId]) {
        cardsByColumn[card.columnId] = [];
      }
      cardsByColumn[card.columnId].push({
        id: card.id,
        title: card.title,
        description: card.description,
        order: card.order,
        complaintId: card.complaintId,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      });
    }

    return cardsByColumn;
  }
}

import { Provider } from '@nestjs/common';
import { KANBAN_TOKENS } from './kanban.tokens';

// Repositories
import { KanbanBoardPrismaRepository } from '../repository-adapters/kanban-board-prisma.repository';
import { KanbanColumnPrismaRepository } from '../repository-adapters/kanban-column-prisma.repository';
import { KanbanCardPrismaRepository } from '../repository-adapters/kanban-card-prisma.repository';

// Use Cases
import { MoveCardUseCase } from '../../2-application/use-cases/move-card.usecase';
import { GetBoardUseCase } from '../../2-application/use-cases/get-board.usecase';
import { InitializeBoardUseCase } from '../../2-application/use-cases/initialize-board.usecase';
import { GetBoardCardsUseCase } from '../../2-application/use-cases/get-board-cards.usecase';

export const kanbanProviders: Provider[] = [
  // Repositories
  {
    provide: KANBAN_TOKENS.KANBAN_BOARD_REPOSITORY,
    useClass: KanbanBoardPrismaRepository,
  },
  {
    provide: KANBAN_TOKENS.KANBAN_COLUMN_REPOSITORY,
    useClass: KanbanColumnPrismaRepository,
  },
  {
    provide: KANBAN_TOKENS.KANBAN_CARD_REPOSITORY,
    useClass: KanbanCardPrismaRepository,
  },

  // Use Cases
  {
    provide: KANBAN_TOKENS.MOVE_CARD_USECASE,
    useClass: MoveCardUseCase,
  },
  {
    provide: KANBAN_TOKENS.GET_BOARD_USECASE,
    useClass: GetBoardUseCase,
  },
  {
    provide: KANBAN_TOKENS.INITIALIZE_BOARD_USECASE,
    useClass: InitializeBoardUseCase,
  },
  {
    provide: KANBAN_TOKENS.GET_BOARD_CARDS_USECASE,
    useClass: GetBoardCardsUseCase,
  },
];

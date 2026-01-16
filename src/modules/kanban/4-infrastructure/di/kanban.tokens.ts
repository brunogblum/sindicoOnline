export const KANBAN_TOKENS = {
  // Repositories
  KANBAN_BOARD_REPOSITORY: Symbol('IKanbanBoardRepository'),
  KANBAN_COLUMN_REPOSITORY: Symbol('IKanbanColumnRepository'),
  KANBAN_CARD_REPOSITORY: Symbol('IKanbanCardRepository'),

  // Use Cases
  MOVE_CARD_USECASE: Symbol('MoveCardUseCase'),
  GET_BOARD_USECASE: Symbol('GetBoardUseCase'),
  INITIALIZE_BOARD_USECASE: Symbol('InitializeBoardUseCase'),
  GET_BOARD_CARDS_USECASE: Symbol('GetBoardCardsUseCase'),
};

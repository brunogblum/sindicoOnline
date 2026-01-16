import { Controller, Get, Post, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/3-interface-adapters/guards/jwt-auth.guard';
import type { GetBoardUseCase, InitializeBoardUseCase, GetBoardCardsUseCase } from '../../2-application';
import { KANBAN_TOKENS } from '../../4-infrastructure';
import { MoveCardRequestDto } from '../api-dto/move-card-request.dto';
import { BoardResponseDto } from '../api-dto/board-response.dto';

@Controller('kanban')
@UseGuards(JwtAuthGuard)
export class KanbanController {
  constructor(
    @Inject(KANBAN_TOKENS.GET_BOARD_USECASE)
    private readonly getBoardUseCase: GetBoardUseCase,
    @Inject(KANBAN_TOKENS.INITIALIZE_BOARD_USECASE)
    private readonly initializeBoardUseCase: InitializeBoardUseCase,
    @Inject(KANBAN_TOKENS.GET_BOARD_CARDS_USECASE)
    private readonly getBoardCardsUseCase: GetBoardCardsUseCase,
  ) {}

  @Get('board')
  async getBoard(): Promise<BoardResponseDto> {
    // Inicializar board se não existir
    const boardId = await this.initializeBoardUseCase.execute();

    // Buscar dados completos do board
    const boardData = await this.getBoardUseCase.execute(boardId);

    return {
      id: boardData.board.id,
      title: boardData.board.title,
      columns: boardData.columns,
    };
  }

  @Get('board/:boardId/cards')
  async getBoardCards(@Param('boardId') boardId: string) {
    return await this.getBoardCardsUseCase.execute(boardId);
  }

  @Post('board/:boardId/cards/move')
  async moveCard(
    @Param('boardId') boardId: string,
    @Body() dto: MoveCardRequestDto,
  ): Promise<{ success: boolean; message: string }> {
    // A lógica de movimento será tratada pelo WebSocket Gateway
    // Este endpoint é mantido para compatibilidade REST
    return {
      success: true,
      message: 'Movimento processado via WebSocket',
    };
  }
}

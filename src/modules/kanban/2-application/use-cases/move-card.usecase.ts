import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IKanbanCardRepository } from '../../1-domain';
import { KANBAN_TOKENS } from '../../4-infrastructure';
import { MoveCardDto, MoveCardResponseDto } from '../dto/move-card.dto';

@Injectable()
export class MoveCardUseCase {
  constructor(
    @Inject(KANBAN_TOKENS.KANBAN_CARD_REPOSITORY)
    private readonly cardRepository: IKanbanCardRepository,
  ) {}

  async execute(dto: MoveCardDto): Promise<MoveCardResponseDto> {
    // Verificar se o card existe
    const card = await this.cardRepository.findById(dto.cardId);
    if (!card) {
      throw new NotFoundException(`Card com ID ${dto.cardId} não encontrado`);
    }

    // Validar se o card pertence ao board correto
    if (card.boardId !== dto.boardId) {
      throw new NotFoundException('Card não pertence ao board especificado');
    }

    // Se está movendo para a mesma coluna, apenas reordenar
    if (dto.fromColumnId === dto.toColumnId) {
      await this.reorderCardsInColumn(dto.toColumnId, dto.cardId, dto.newIndex);
    } else {
      // Movendo para coluna diferente
      await this.moveCardBetweenColumns(dto);
    }

    return {
      success: true,
      cardId: dto.cardId,
      newColumnId: dto.toColumnId,
      newOrder: dto.newIndex,
      movedAt: new Date(),
    };
  }

  private async reorderCardsInColumn(columnId: string, cardId: string, newIndex: number): Promise<void> {
    // Buscar todos os cards da coluna ordenados
    const cards = await this.cardRepository.findByColumnId(columnId);
    const sortedCards = cards.sort((a, b) => a.order - b.order);

    // Encontrar o card que está sendo movido
    const movingCard = sortedCards.find(c => c.id === cardId);
    if (!movingCard) return;

    // Remover o card da posição atual
    const filteredCards = sortedCards.filter(c => c.id !== cardId);

    // Inserir na nova posição
    filteredCards.splice(newIndex, 0, movingCard);

    // Recalcular ordens usando estratégia resiliente (multiplicar por 100)
    const orderUpdates = filteredCards.map((card, index) => ({
      id: card.id,
      order: (index + 1) * 100, // Estratégia resiliente
    }));

    await this.cardRepository.updateOrdersInColumn(columnId, orderUpdates);
  }

  private async moveCardBetweenColumns(dto: MoveCardDto): Promise<void> {
    // 1. Remover card da coluna origem
    const fromColumnCards = await this.cardRepository.findByColumnId(dto.fromColumnId);
    const remainingFromCards = fromColumnCards
      .filter(c => c.id !== dto.cardId)
      .sort((a, b) => a.order - b.order);

    // Recalcular ordens da coluna origem
    const fromOrderUpdates = remainingFromCards.map((card, index) => ({
      id: card.id,
      order: (index + 1) * 100,
    }));

    // 2. Adicionar card na coluna destino
    const toColumnCards = await this.cardRepository.findByColumnId(dto.toColumnId);
    const sortedToCards = toColumnCards.sort((a, b) => a.order - b.order);

    // Inserir na nova posição
    sortedToCards.splice(dto.newIndex, 0, null as any); // Placeholder

    // Recalcular ordens da coluna destino incluindo o novo card
    const toOrderUpdates = sortedToCards.map((card, index) => {
      if (!card) {
        // Este é o placeholder para o card movido
        return { id: dto.cardId, order: (index + 1) * 100 };
      }
      return { id: card.id, order: (index + 1) * 100 };
    });

    // 3. Executar as atualizações
    await Promise.all([
      this.cardRepository.updateOrdersInColumn(dto.fromColumnId, fromOrderUpdates),
      this.cardRepository.updateOrdersInColumn(dto.toColumnId, toOrderUpdates),
      this.cardRepository.moveCard(dto.cardId, dto.toColumnId, (dto.newIndex + 1) * 100),
    ]);
  }
}

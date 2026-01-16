import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IKanbanCardRepository, KanbanCard } from '../../1-domain';

@Injectable()
export class KanbanCardPrismaRepository implements IKanbanCardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(card: KanbanCard): Promise<KanbanCard> {
    const data = await this.prisma.kanbanCard.create({
      data: {
        id: card.id,
        title: card.title,
        description: card.description,
        columnId: card.columnId,
        boardId: card.boardId,
        order: card.order,
        complaintId: card.complaintId,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      },
    });

    return KanbanCard.fromDatabase(data);
  }

  async findById(id: string): Promise<KanbanCard | null> {
    const data = await this.prisma.kanbanCard.findUnique({
      where: { id },
    });

    return data ? KanbanCard.fromDatabase(data) : null;
  }

  async findByBoardId(boardId: string): Promise<KanbanCard[]> {
    const data = await this.prisma.kanbanCard.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
    });

    return data.map(item => KanbanCard.fromDatabase(item));
  }

  async findByColumnId(columnId: string): Promise<KanbanCard[]> {
    const data = await this.prisma.kanbanCard.findMany({
      where: { columnId },
      orderBy: { order: 'asc' },
    });

    return data.map(item => KanbanCard.fromDatabase(item));
  }

  async findByComplaintId(complaintId: string): Promise<KanbanCard | null> {
    const data = await this.prisma.kanbanCard.findUnique({
      where: { complaintId },
    });

    return data ? KanbanCard.fromDatabase(data) : null;
  }

  async update(card: KanbanCard): Promise<KanbanCard> {
    const data = await this.prisma.kanbanCard.update({
      where: { id: card.id },
      data: {
        title: card.title,
        description: card.description,
        columnId: card.columnId,
        order: card.order,
        updatedAt: card.updatedAt,
      },
    });

    return KanbanCard.fromDatabase(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.kanbanCard.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.kanbanCard.count({
      where: { id },
    });
    return count > 0;
  }

  async moveCard(cardId: string, columnId: string, newOrder: number): Promise<void> {
    await this.prisma.kanbanCard.update({
      where: { id: cardId },
      data: {
        columnId,
        order: newOrder,
        updatedAt: new Date(),
      },
    });
  }

  async updateOrdersInColumn(columnId: string, cards: { id: string; order: number }[]): Promise<void> {
    const updates = cards.map(({ id, order }) =>
      this.prisma.kanbanCard.update({
        where: { id },
        data: { order },
      })
    );

    await this.prisma.$transaction(updates);
  }
}



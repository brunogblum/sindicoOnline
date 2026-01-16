import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IKanbanColumnRepository, KanbanColumn } from '../../1-domain';

@Injectable()
export class KanbanColumnPrismaRepository implements IKanbanColumnRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(column: KanbanColumn): Promise<KanbanColumn> {
    const data = await this.prisma.kanbanColumn.create({
      data: {
        id: column.id,
        title: column.title,
        boardId: column.boardId,
        order: column.order,
      },
    });

    return KanbanColumn.fromDatabase(data);
  }

  async findById(id: string): Promise<KanbanColumn | null> {
    const data = await this.prisma.kanbanColumn.findUnique({
      where: { id },
    });

    return data ? KanbanColumn.fromDatabase(data) : null;
  }

  async findByBoardId(boardId: string): Promise<KanbanColumn[]> {
    const data = await this.prisma.kanbanColumn.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
    });

    return data.map(item => KanbanColumn.fromDatabase(item));
  }

  async update(column: KanbanColumn): Promise<KanbanColumn> {
    const data = await this.prisma.kanbanColumn.update({
      where: { id: column.id },
      data: {
        title: column.title,
        order: column.order,
      },
    });

    return KanbanColumn.fromDatabase(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.kanbanColumn.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.kanbanColumn.count({
      where: { id },
    });
    return count > 0;
  }

  async updateOrders(columns: { id: string; order: number }[]): Promise<void> {
    const updates = columns.map(({ id, order }) =>
      this.prisma.kanbanColumn.update({
        where: { id },
        data: { order },
      })
    );

    await this.prisma.$transaction(updates);
  }
}



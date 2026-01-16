import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IKanbanBoardRepository, KanbanBoard } from '../../1-domain';

@Injectable()
export class KanbanBoardPrismaRepository implements IKanbanBoardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(board: KanbanBoard): Promise<KanbanBoard> {
    const data = await this.prisma.kanbanBoard.create({
      data: {
        id: board.id,
        title: board.title,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      },
    });

    return KanbanBoard.fromDatabase(data);
  }

  async findById(id: string): Promise<KanbanBoard | null> {
    const data = await this.prisma.kanbanBoard.findUnique({
      where: { id },
    });

    return data ? KanbanBoard.fromDatabase(data) : null;
  }

  async findAll(): Promise<KanbanBoard[]> {
    const data = await this.prisma.kanbanBoard.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return data.map(item => KanbanBoard.fromDatabase(item));
  }

  async update(board: KanbanBoard): Promise<KanbanBoard> {
    const data = await this.prisma.kanbanBoard.update({
      where: { id: board.id },
      data: {
        title: board.title,
        updatedAt: board.updatedAt,
      },
    });

    return KanbanBoard.fromDatabase(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.kanbanBoard.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.kanbanBoard.count({
      where: { id },
    });
    return count > 0;
  }
}



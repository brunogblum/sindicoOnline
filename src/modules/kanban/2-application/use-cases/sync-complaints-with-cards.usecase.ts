import { Injectable } from '@nestjs/common';
import type { IKanbanBoardRepository, IKanbanColumnRepository, IKanbanCardRepository } from '../../1-domain';
import { KanbanCard } from '../../1-domain';

// Interface para reclamação (vinda de outro módulo)
interface ComplaintData {
  id: string;
  description: string;
  status: 'PENDENTE' | 'EM_ANALISE' | 'RESOLVIDA' | 'REJEITADA';
  authorName?: string;
}

@Injectable()
export class SyncComplaintsWithCardsUseCase {
  constructor(
    private readonly boardRepository: IKanbanBoardRepository,
    private readonly columnRepository: IKanbanColumnRepository,
    private readonly cardRepository: IKanbanCardRepository,
  ) {}

  async execute(complaints: ComplaintData[]): Promise<void> {
    // Buscar ou criar board padrão
    let boards = await this.boardRepository.findAll();
    let board = boards[0];

    if (!board) {
      // Se não existe board, criar um
      const { KanbanBoard } = await import('../../1-domain/index.js');
      board = new KanbanBoard(undefined, 'Board de Reclamações');
      board = await this.boardRepository.create(board);

      // Criar colunas padrão
      const { KanbanColumn } = await import('../../1-domain/index.js');
      const columns = [
        { title: 'Pendente', order: 100 },
        { title: 'Em Análise', order: 200 },
        { title: 'Resolvida', order: 300 },
        { title: 'Rejeitada', order: 400 },
      ];

      for (const col of columns) {
        const column = new KanbanColumn(board.id, col.title, col.order);
        await this.columnRepository.create(column);
      }
    }

    // Buscar colunas do board
    const columns = await this.columnRepository.findByBoardId(board.id);
    const columnMap = new Map(columns.map(col => [col.title, col.id]));

    // Processar cada reclamação
    for (const complaint of complaints) {
      // Verificar se já existe um card para esta reclamação
      const existingCard = await this.cardRepository.findByComplaintId(complaint.id);

      if (existingCard) {
        // Atualizar card existente se necessário
        const columnTitle = this.mapStatusToColumnTitle(complaint.status);
        const columnId = columnMap.get(columnTitle);

        if (columnId && existingCard.columnId !== columnId) {
          // Card precisa ser movido para outra coluna
          await this.cardRepository.moveCard(existingCard.id, columnId, existingCard.order);
        }

        // Atualizar título e descrição se necessário
        const needsUpdate =
          existingCard.title !== this.generateCardTitle(complaint) ||
          existingCard.description !== complaint.description;

        if (needsUpdate) {
          existingCard.title = this.generateCardTitle(complaint);
          existingCard.description = complaint.description;
          await this.cardRepository.update(existingCard);
        }
      } else {
        // Criar novo card
        const columnTitle = this.mapStatusToColumnTitle(complaint.status);
        const columnId = columnMap.get(columnTitle);

        if (columnId) {
          // Calcular ordem: adicionar no final da coluna
          const columnCards = await this.cardRepository.findByColumnId(columnId);
          const maxOrder = columnCards.length > 0 ? Math.max(...columnCards.map(c => c.order)) : 0;
          const newOrder = maxOrder + 100;

          const newCard = new KanbanCard(
            board.id,
            columnId,
            this.generateCardTitle(complaint),
            newOrder,
            complaint.description,
            complaint.id
          );

          await this.cardRepository.create(newCard);
        }
      }
    }
  }

  private mapStatusToColumnTitle(status: string): string {
    const statusMap = {
      PENDENTE: 'Pendente',
      EM_ANALISE: 'Em Análise',
      RESOLVIDA: 'Resolvida',
      REJEITADA: 'Rejeitada',
    };
    return statusMap[status as keyof typeof statusMap] || 'Pendente';
  }

  private generateCardTitle(complaint: ComplaintData): string {
    // Usar os primeiros 50 caracteres da descrição como título
    const maxTitleLength = 50;
    const title = complaint.description.length > maxTitleLength
      ? complaint.description.substring(0, maxTitleLength) + '...'
      : complaint.description;

    return title;
  }
}

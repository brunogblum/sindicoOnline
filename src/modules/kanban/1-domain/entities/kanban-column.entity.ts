import { v4 as uuid } from 'uuid';

export class KanbanColumn {
  private _id: string;
  private _title: string;
  private _boardId: string;
  private _order: number;

  constructor(boardId: string, title: string, order: number, id?: string) {
    this._id = id || uuid();
    this._boardId = boardId;
    this._title = title;
    this._order = order;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get boardId(): string {
    return this._boardId;
  }

  get order(): number {
    return this._order;
  }

  // Setters
  set title(title: string) {
    this._title = title;
  }

  set order(order: number) {
    this._order = order;
  }

  // Métodos de negócio
  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Título da coluna não pode ser vazio');
    }
    this.title = title.trim();
  }

  updateOrder(order: number): void {
    if (order < 0) {
      throw new Error('Ordem da coluna não pode ser negativa');
    }
    this.order = order;
  }

  // Método para reconstruir entidade do banco
  static fromDatabase(data: {
    id: string;
    title: string;
    boardId: string;
    order: number;
  }): KanbanColumn {
    return new KanbanColumn(data.boardId, data.title, data.order, data.id);
  }
}



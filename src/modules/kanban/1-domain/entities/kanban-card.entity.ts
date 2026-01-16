import { v4 as uuid } from 'uuid';

export class KanbanCard {
  private _id: string;
  private _title: string;
  private _description?: string;
  private _columnId: string;
  private _boardId: string;
  private _order: number;
  private _complaintId?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    boardId: string,
    columnId: string,
    title: string,
    order: number,
    description?: string,
    complaintId?: string,
    id?: string
  ) {
    this._id = id || uuid();
    this._boardId = boardId;
    this._columnId = columnId;
    this._title = title;
    this._description = description;
    this._order = order;
    this._complaintId = complaintId;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | undefined {
    return this._description;
  }

  get columnId(): string {
    return this._columnId;
  }

  get boardId(): string {
    return this._boardId;
  }

  get order(): number {
    return this._order;
  }

  get complaintId(): string | undefined {
    return this._complaintId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters
  set title(title: string) {
    this._title = title;
    this._updatedAt = new Date();
  }

  set description(description: string | undefined) {
    this._description = description;
    this._updatedAt = new Date();
  }

  set columnId(columnId: string) {
    this._columnId = columnId;
    this._updatedAt = new Date();
  }

  set order(order: number) {
    this._order = order;
    this._updatedAt = new Date();
  }

  // Métodos de negócio
  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Título do card não pode ser vazio');
    }
    this.title = title.trim();
  }

  updateDescription(description?: string): void {
    this.description = description?.trim();
  }

  moveToColumn(columnId: string): void {
    if (!columnId) {
      throw new Error('ID da coluna é obrigatório');
    }
    this.columnId = columnId;
  }

  updateOrder(order: number): void {
    if (order < 0) {
      throw new Error('Ordem do card não pode ser negativa');
    }
    this.order = order;
  }

  // Método para reconstruir entidade do banco
  static fromDatabase(data: {
    id: string;
    title: string;
    description: string | null;
    columnId: string;
    boardId: string;
    order: number;
    complaintId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): KanbanCard {
    const card = new KanbanCard(
      data.boardId,
      data.columnId,
      data.title,
      data.order,
      data.description || undefined,
      data.complaintId || undefined,
      data.id
    );
    card._createdAt = data.createdAt;
    card._updatedAt = data.updatedAt;
    return card;
  }
}

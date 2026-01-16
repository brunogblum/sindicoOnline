import { v4 as uuid } from 'uuid';

export class KanbanBoard {
  private _id: string;
  private _title: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(id?: string, title?: string) {
    this._id = id || uuid();
    this._title = title || 'Board de Reclamações';
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

  // Métodos de negócio
  updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Título do board não pode ser vazio');
    }
    this.title = title.trim();
  }

  // Método para reconstruir entidade do banco
  static fromDatabase(data: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
  }): KanbanBoard {
    const board = new KanbanBoard(data.id, data.title);
    board._createdAt = data.createdAt;
    board._updatedAt = data.updatedAt;
    return board;
  }
}



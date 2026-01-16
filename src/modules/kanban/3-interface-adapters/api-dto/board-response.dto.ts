import { Expose, Type } from 'class-transformer';

export class CardResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  order: number;

  @Expose()
  complaintId?: string;
}

export class ColumnResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  order: number;

  @Expose()
  @Type(() => CardResponseDto)
  cards: CardResponseDto[];
}

export class BoardResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => ColumnResponseDto)
  columns: ColumnResponseDto[];
}



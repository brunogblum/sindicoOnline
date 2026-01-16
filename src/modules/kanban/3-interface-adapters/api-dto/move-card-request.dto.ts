import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class MoveCardRequestDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  fromColumnId: string;

  @IsString()
  @IsNotEmpty()
  toColumnId: string;

  @IsNumber()
  @Min(0)
  newIndex: number;

  @IsString()
  @IsNotEmpty()
  boardId: string;
}



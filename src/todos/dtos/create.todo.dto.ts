import { IsBoolean, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  readonly text: string;

  @IsBoolean()
  readonly completed: boolean;
}

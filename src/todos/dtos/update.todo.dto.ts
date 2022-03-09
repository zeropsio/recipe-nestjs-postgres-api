import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  readonly text: string;

  @IsOptional()
  @IsBoolean()
  readonly completed: boolean;
}

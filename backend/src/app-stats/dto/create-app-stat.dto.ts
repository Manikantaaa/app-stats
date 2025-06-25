import { IsDateString, IsInt } from 'class-validator';

export class CreateAppStatDto {
  @IsDateString()
  as_date: string;

  @IsInt()
  as_app_id: number;

  @IsInt()
  as_count: number;

  @IsInt()
  as_status: number;
}

import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppStatsDto {
  @IsDateString()
  as_date: string; // e.g. "2024-06-30T00:00:00Z"

  @IsMongoId()
  as_ua_id: string;

  @IsMongoId()
  as_ai_id: string;

  @IsNumber()
  as_count: number;

  @IsOptional()
  @IsNumber()
  as_status?: number; // 0=hidden, 1=active, 2=deleted
}

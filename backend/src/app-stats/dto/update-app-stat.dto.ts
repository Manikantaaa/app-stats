import {
  IsDateString,
  IsMongoId,
  IsInt,
  IsOptional,
  Min,
  Max,
  IsNumber,
} from 'class-validator';


export class UpdateAppStatsDto {
  @IsOptional()
  @IsDateString()
  as_date?: string;

  @IsOptional()
  @IsMongoId()
  as_ua_id?: string;

  @IsOptional()
  @IsMongoId()
  as_ai_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  as_count?: number;

  @IsOptional()
  @IsNumber()
 
  as_status?: number;
}

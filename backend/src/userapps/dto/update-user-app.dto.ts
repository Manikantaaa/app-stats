import { IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserAppDto {
  @IsArray()
  @Type(() => String)
  appIds: string[];
}

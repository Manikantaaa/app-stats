import { IsString, IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserAppDto {
  @IsString()
  userId: string;

  @IsArray()
  @Type(() => String)
  appIds: string[];
}

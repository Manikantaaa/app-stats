import { IsString, IsArray, ArrayNotEmpty, IsMongoId, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserAppDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @Type(() => String)
  appIds: string[];
}

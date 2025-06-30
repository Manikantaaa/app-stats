import { IsString, IsNotEmpty} from 'class-validator';

export class CreateAppDto {
  @IsString()
  @IsNotEmpty()
  app_name: string;

  @IsString()
  @IsNotEmpty()
  app_status: Number;

}
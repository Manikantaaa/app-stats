import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAppDto {
  @IsString()
  @IsNotEmpty()
  app_name: string;
}
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstname: string;

  @IsString()
   lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  status: string;
  
  @IsString()
  role: string;
}
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  status: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}



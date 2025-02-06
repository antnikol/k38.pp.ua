import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsArray()
  @IsOptional()
  roles?: string[]; // Опційно можемо передавати ролі
}

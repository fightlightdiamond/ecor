import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() @MaxLength(255) name!: string;
  @IsString() @IsNotEmpty() @MaxLength(50) phone!: string;
  @IsOptional() @IsEmail() @MaxLength(255) email?: string;
  @IsString() @MinLength(6) @MaxLength(255) password!: string;
}

export class LoginDto {
  @IsString() @IsNotEmpty() phone!: string;
  @IsString() @IsNotEmpty() password!: string;
}

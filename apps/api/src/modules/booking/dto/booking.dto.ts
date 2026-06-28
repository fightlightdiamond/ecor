import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SubmitBookingDto {
  @IsString() @IsNotEmpty() @MaxLength(255) name!: string;
  @IsString() @IsNotEmpty() @MaxLength(50) phone!: string;
  @IsOptional() @IsEmail() @MaxLength(255) email?: string;
  @IsOptional() @IsString() @MaxLength(255) service?: string;
  @IsOptional() @Type(() => Number) @IsInt() staff_id?: number;
  @IsOptional() @IsDateString() preferred_date?: string;
  @IsOptional() @IsString() @MaxLength(20) preferred_time?: string;
  @IsOptional() @IsString() @MaxLength(5000) note?: string;
}

export class SubmitContactDto {
  @IsString() @IsNotEmpty() @MaxLength(255) name!: string;
  @IsString() @IsNotEmpty() @MaxLength(50) phone!: string;
  @IsOptional() @IsEmail() @MaxLength(255) email?: string;
  @IsOptional() @IsString() @MaxLength(255) service?: string;
  @IsOptional() @IsString() @MaxLength(5000) message?: string;
  @IsOptional() @IsString() @MaxLength(50) source?: string;
}

export class AvailabilityDto {
  @IsDateString() date!: string;
}

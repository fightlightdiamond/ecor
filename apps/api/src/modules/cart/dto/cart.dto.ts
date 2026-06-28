import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class AddToCartDto {
  @Type(() => Number)
  @IsInt()
  product_id!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class UpdateCartDto {
  @Type(() => Number)
  @IsInt()
  item_id!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity!: number;
}

export class RemoveCartDto {
  @Type(() => Number)
  @IsInt()
  item_id!: number;
}

export class ValidateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cart_total!: number;
}

import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  defaultPrice: number;

  @IsUUID()
  @IsOptional()
  vatId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  companyId: string;

  @IsString()
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

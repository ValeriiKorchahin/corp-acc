import { PartialType } from '@nestjs/mapped-types';
import { CreateVatDto } from './create-vat.dto';

export class UpdateVatDto extends PartialType(CreateVatDto) {}

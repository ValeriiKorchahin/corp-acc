import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { VatService } from './vat.service';
import { CreateVatDto } from './dto/create-vat.dto';
import { UpdateVatDto } from './dto/update-vat.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CompanyAccessGuard } from '../company-access/company-access.guard';

@UseGuards(JwtAuthGuard, CompanyAccessGuard)
@Controller('company/:companyId/vat')
export class VatController {
  constructor(private readonly vatService: VatService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createVatDto: CreateVatDto,
  ) {
    return this.vatService.create(companyId, createVatDto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.vatService.findAll(companyId);
  }

  @Get('deactivated')
  findDeactivated(@Param('companyId') companyId: string) {
    return this.vatService.findDeactivated(companyId);
  }

  @Get(':id')
  findOne(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.vatService.findOne(companyId, id);
  }

  @Put(':id')
  update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() updateVatDto: UpdateVatDto,
  ) {
    return this.vatService.update(companyId, id, updateVatDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.vatService.deactivate(companyId, id);
  }

  @Patch(':id/activate')
  activate(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.vatService.deactivate(companyId, id);
  }

  @Delete(':id')
  remove(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.vatService.remove(companyId, id);
  }
}

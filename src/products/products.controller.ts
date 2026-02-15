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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CompanyAccessGuard } from '../company-access/company-access.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard, CompanyAccessGuard)
@Controller('company/:companyId/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(companyId, createProductDto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.productsService.findAll(companyId);
  }

  @Get('deactivated')
  findDeactivated(@Param('companyId') companyId: string) {
    return this.productsService.findDeactivated(companyId);
  }

  @Get(':id')
  findOne(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.productsService.findOne(companyId, id);
  }

  @Put(':id')
  update(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(companyId, id, updateProductDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.productsService.deactivate(companyId, id);
  }

  @Patch(':id/activate')
  activate(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.productsService.activate(companyId, id);
  }

  @Delete(':id')
  remove(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.productsService.remove(companyId, id);
  }
}

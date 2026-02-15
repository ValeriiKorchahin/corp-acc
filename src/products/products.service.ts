import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(companyId: string, dto: CreateProductDto) {
    await this.validateVat(dto.vatId, companyId);
    return this.prismaService.product.create({
      data: {
        ...dto,
        companyId,
      },
      include: {
        vat: true,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prismaService.product.findMany({
      where: {
        companyId: companyId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        vat: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findDeactivated(companyId: string) {
    return this.prismaService.product.findMany({
      where: {
        companyId: companyId,
        isActive: false,
        deletedAt: null,
      },
      include: {
        vat: true,
      },
    });
  }

  async findOne(companyId: string, id: string) {
    const product = await this.prismaService.product.findFirst({
      where: {
        id,
        companyId,
        deletedAt: null,
      },
      include: {
        vat: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product is not found`);
    }
    return product;
  }

  async update(companyId: string, id: string, dto: UpdateProductDto) {
    await this.findOne(companyId, id);
    await this.validateVat(dto.vatId, companyId);
    return this.prismaService.product.update({
      where: {
        id,
      },
      data: dto,
      include: {
        vat: true,
      },
    });
  }

  async deactivate(companyId: string, id: string) {
    const product = await this.findOne(companyId, id);
    if (!product.isActive) {
      throw new BadRequestException(`Product is already deactivated`);
    }
    return this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      include: {
        vat: true,
      },
    });
  }

  async activate(companyId: string, id: string) {
    const product = await this.findOne(companyId, id);
    if (product?.isActive) {
      throw new BadRequestException(`Product is already deactivated`);
    }
    return this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      include: {
        vat: true,
      },
    });
  }

  async remove(companyId: string, id: string) {
    const product = await this.findOne(companyId, id);
    if (product?.isActive) {
      throw new BadRequestException(
        `Cannot delete active product. Deactivate it first`,
      );
    }
    await this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return;
  }

  private async validateVat(vatId: string | undefined, companyId: string) {
    if (vatId) {
      return;
    }
    if (vatId) {
      const vat = await this.prismaService.vat.findFirst({
        where: {
          id: vatId,
          companyId: companyId,
          isActive: true,
        },
      });
      if (!vat) {
        throw new NotFoundException('Active VAT Not Found.');
      }
    }
  }
}

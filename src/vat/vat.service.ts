import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVatDto } from './dto/create-vat.dto';
import { UpdateVatDto } from './dto/update-vat.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VatService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(companyId: string, dto: CreateVatDto) {
    return this.prismaService.vat.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prismaService.vat.findMany({
      where: {
        companyId,
        isActive: true,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findDeactivated(companyId: string) {
    return this.prismaService.vat.findMany({
      where: {
        companyId,
        isActive: false,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(companyId: string, id: string, isActive = true) {
    const vat = await this.prismaService.vat.findFirst({
      where: {
        companyId,
        id,
        isActive,
        deletedAt: null,
      },
    });
    if (!vat) {
      throw new NotFoundException(`VAT is not found`);
    }
    return vat;
  }

  async update(companyId: string, id: string, updateVatDto: UpdateVatDto) {
    await this.findOne(companyId, id);
    return this.prismaService.vat.update({
      where: {
        id,
      },
      data: updateVatDto,
    });
  }

  async deactivate(companyId: string, id: string) {
    await this.findOne(companyId, id);
    return this.prismaService.vat.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async activate(companyId: string, id: string) {
    await this.findOne(companyId, id, false);
    return this.prismaService.vat.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });
  }

  async remove(companyId: string, id: string) {
    const vat = await this.findOne(companyId, id, false);
    if (vat.isActive) {
      throw new BadRequestException(
        `Cannot delete active VAT. Deactivate it first.`,
      );
    }
    return this.prismaService.vat.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

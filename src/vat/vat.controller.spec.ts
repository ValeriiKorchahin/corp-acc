import { Test, TestingModule } from '@nestjs/testing';
import { VatController } from './vat.controller';
import { VatService } from './vat.service';

describe('VatController', () => {
  let controller: VatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VatController],
      providers: [VatService],
    }).compile();

    controller = module.get<VatController>(VatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

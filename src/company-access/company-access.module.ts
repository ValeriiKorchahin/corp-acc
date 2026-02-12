import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CompanyAccessService } from './company-access.service';
import { CompanyAccessGuard } from './company-access.guard';

@Global()
@Module({
  imports: [HttpModule],
  providers: [CompanyAccessService, CompanyAccessGuard],
  exports: [CompanyAccessService, CompanyAccessGuard],
})
export class CompanyAccessModule {}

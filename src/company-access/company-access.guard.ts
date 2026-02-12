/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CompanyAccessService } from './company-access.service';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(private readonly companyAccessService: CompanyAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { userId } = req.user;
    const { companyId } = req.params;

    if (!companyId) {
      throw new BadRequestException('Company ID is required');
    }
    const access = await this.companyAccessService.validate(userId, companyId);
    if (!access) {
      throw new ForbiddenException();
    }
    req.companyContext = {
      companyId,
      role: access.role,
    };
    return true;
  }
}

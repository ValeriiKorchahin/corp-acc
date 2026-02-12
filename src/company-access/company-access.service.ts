import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../cache/redis.service';
import { HttpService } from '@nestjs/axios';

type CompanyAccessResponse = {
  role: number;
};

@Injectable()
export class CompanyAccessService {
  constructor(
    private readonly redisService: RedisService,
    private readonly http: HttpService,
  ) {}

  private readonly _url = `${process.env.CORP_DB_URL}/internal/company-access`;

  async validate(
    userId: string,
    companyId: string,
  ): Promise<CompanyAccessResponse> {
    const cacheKey = `company-access:${userId}:${companyId}`;
    const cached = await this.redisService.get<CompanyAccessResponse>(cacheKey);
    if (cached) {
      return cached;
    }
    return await this.requestAccess(userId, companyId, cacheKey);
  }

  private async requestAccess(
    userId: string,
    companyId: string,
    cacheKey: string,
  ) {
    try {
      const body = {
        userId: userId,
        companyId: companyId,
      };
      const response = await this.http.axiosRef.post(this._url, body, {
        headers: {
          'x-service-key': process.env.SERVICE_KEY,
        },
      });
      const data = response.data as CompanyAccessResponse;
      if (data) {
        await this.redisService.set(cacheKey, data);
      }
      return data;
    } catch (error) {
      throw new UnauthorizedException('Access validation failed');
    }
  }
}

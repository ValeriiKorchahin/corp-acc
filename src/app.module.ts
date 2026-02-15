import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { RedisModule } from './cache/redis.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CompanyAccessModule } from './company-access/company-access.module';
import { VatModule } from './vat/vat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    RedisModule,
    CompanyAccessModule,
    ProductsModule,
    VatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly _client: Redis;

  constructor() {
    this._client = new Redis({
      port: 6379,
      host: process.env.REDIS_HOST || 'localhost',
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this._client.get(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value);

    if (ttlSeconds) {
      await this._client.set(key, stringValue, 'EX', ttlSeconds);
    } else {
      await this._client.set(key, stringValue);
    }
  }

  async delete(key: string): Promise<void> {
    await this._client.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    await this._client.quit();
  }
}
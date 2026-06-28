import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness + dependency health (DB, Redis)' })
  async check() {
    const [db, redis] = await Promise.all([this.checkDb(), this.checkRedis()]);
    const ok = db.status === 'up' && redis.status === 'up';
    return {
      success: ok,
      data: {
        status: ok ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        services: { database: db, redis },
      },
    };
  }

  private async checkDb() {
    try {
      await this.prisma.ping();
      return { status: 'up' as const };
    } catch (e) {
      return { status: 'down' as const, message: (e as Error).message };
    }
  }

  private async checkRedis() {
    try {
      const pong = await this.redis.ping();
      return { status: pong === 'PONG' ? ('up' as const) : ('down' as const) };
    } catch (e) {
      return { status: 'down' as const, message: (e as Error).message };
    }
  }
}

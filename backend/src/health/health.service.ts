import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getHealth(): { ok: boolean } {
    return { ok: true };
  }

  async getDbHealth(): Promise<{ db: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { db: 'ok' };
    } catch {
      return { db: 'error' };
    }
  }
}

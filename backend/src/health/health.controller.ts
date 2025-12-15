import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): { ok: boolean } {
    return this.healthService.getHealth();
  }

  @Get('db')
  async getDbHealth(): Promise<{ db: string }> {
    return this.healthService.getDbHealth();
  }
}

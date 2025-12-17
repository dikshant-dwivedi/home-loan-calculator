import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [PrismaModule, HealthModule, LoanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

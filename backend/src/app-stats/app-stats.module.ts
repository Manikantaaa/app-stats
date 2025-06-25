import { Module } from '@nestjs/common';
import { AppStatsService } from './app-stats.service';
import { AppStatsController } from './app-stats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [AppStatsService],
  controllers: [AppStatsController]
})
export class AppStatsModule {}

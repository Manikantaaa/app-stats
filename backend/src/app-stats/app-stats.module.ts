import { Module } from '@nestjs/common';
import { AppStatsService } from './app-stats.service';
import { AppStatsController } from './app-stats.controller';

@Module({
  providers: [AppStatsService],
  controllers: [AppStatsController]
})
export class AppStatsModule {}

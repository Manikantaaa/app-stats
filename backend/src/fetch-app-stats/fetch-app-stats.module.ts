import { Module } from '@nestjs/common';
import { FetchAppStatsService } from './fetch-app-stats.service';
import { FetchAppStatsController } from './fetch-app-stats.controller';

@Module({
  providers: [FetchAppStatsService],
  controllers: [FetchAppStatsController]
})
export class FetchAppStatsModule {}

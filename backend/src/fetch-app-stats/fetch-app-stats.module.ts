import { Module } from '@nestjs/common';
import { FetchAppStatsService } from './fetch-app-stats.service';
import { FetchAppStatsController } from './fetch-app-stats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FetchAppStatsService],
  controllers: [FetchAppStatsController]
})
export class FetchAppStatsModule {}

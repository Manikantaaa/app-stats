import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import appStatsSchema  from '../models/appStats.schema'; // Make sure this path is correct
import { AppStatsService } from './app-stats.service';
import { AppStatsController } from './app-stats.controller';


@Module({
  imports: [
     MongooseModule.forFeature([{ name: 'AppStats', schema: appStatsSchema }]),
   ],
  providers: [AppStatsService],
  controllers: [AppStatsController]
})
export class AppStatsModule {}

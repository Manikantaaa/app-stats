import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FetchAppStatsService } from './fetch-app-stats.service';
import { FetchAppStatsController } from './fetch-app-stats.controller';

import  AppSchema  from '../models/app.schema';
import  AppApiSchema  from '../models/appApi.schema';
import  AppStatsSchema  from '../models/appStats.schema';
import  UserAppSchema  from '../models/userApp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'App', schema: AppSchema },
      { name: 'AppApi', schema: AppApiSchema },
      { name: 'AppStats', schema: AppStatsSchema },
      { name: 'UserApp', schema: UserAppSchema },
    ]),
  ],
  providers: [FetchAppStatsService],
  controllers: [FetchAppStatsController],
})
export class FetchAppStatsModule {}

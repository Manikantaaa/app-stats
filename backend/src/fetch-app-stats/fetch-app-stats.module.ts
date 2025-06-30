import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FetchAppStatsService } from './fetch-app-stats.service';
import { FetchAppStatsController } from './fetch-app-stats.controller';

import { AppSchema } from '../apps/schemas/app.schema';
import { AppApiSchema } from '../app-api/schemas/app-api.schema';
import { AppStatsSchema } from '../app-stats/schemas/app-stats.schema';
import { UserAppSchema } from '../userapps/schemas/userapp.schema';


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

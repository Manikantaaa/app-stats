import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { AppStatsService } from './app-stats.service';
import { AppStatsController } from './app-stats.controller';
import { AppStatsSchema } from './schemas/app-stats.schema';
import { UserAppSchema } from '../userapps/schemas/userapp.schema';
import { AppSchema } from '../apps/schemas/app.schema';


@Module({
  imports: [
     MongooseModule.forFeature([
      { name: 'AppStats', schema: AppStatsSchema },
       { name: 'UserApp', schema: UserAppSchema },
      { name: 'App', schema: AppSchema },
    ]),
   ],
  providers: [AppStatsService],
  controllers: [AppStatsController]
})
export class AppStatsModule {}

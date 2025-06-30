import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserAppsService } from './userapps.service';
import { UserAppsController } from './userapps.controller';
import { UserAppSchema } from './schemas/userapp.schema';
import { AppSchema } from 'src/apps/schemas/app.schema';


@Module({
 imports: [
     MongooseModule.forFeature([
      { name: 'UserApp', schema: UserAppSchema },
       { name: 'App', schema: AppSchema },
    ]),
   ],
  controllers: [UserAppsController],
  providers: [UserAppsService],
})
export class UserAppsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserAppsService } from './userapps.service';
import { UserAppsController } from './userapps.controller';
import userAppSchema from '../models/userApp.schema';


@Module({
 imports: [
     MongooseModule.forFeature([{ name: 'UserApp', schema: userAppSchema }]),
   ],
  controllers: [UserAppsController],
  providers: [UserAppsService],
})
export class UserAppsModule {}

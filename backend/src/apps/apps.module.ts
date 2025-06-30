import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import appSchema from '../models/app.schema';

@Module({
 imports: [
    MongooseModule.forFeature([{ name: 'App', schema: appSchema }])
  ],
  controllers: [AppsController],
  providers: [AppsService],
})
export class AppsModule {}

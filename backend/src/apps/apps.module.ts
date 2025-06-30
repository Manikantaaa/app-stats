import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { AppSchema } from './schemas/app.schema';


@Module({
 imports: [
    MongooseModule.forFeature([{ name: 'App', schema: AppSchema}])
  ],
  controllers: [AppsController],
  providers: [AppsService],
})
export class AppsModule {}

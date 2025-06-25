import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserAppsService } from './userapps.service';
import { UserAppsController } from './userapps.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [UserAppsController],
  providers: [UserAppsService, PrismaService],
})
export class UserAppsModule {}

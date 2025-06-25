import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
// import { AuthModule } from './auth/auth.module';
import { AppsModule } from './apps/apps.module';
import { UserAppsModule } from './userapps/userapps.module';

@Module({
  imports: [UsersModule, PrismaModule, AppsModule, UserAppsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

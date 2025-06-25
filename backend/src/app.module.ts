import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
import { AppsModule } from './apps/apps.module';
import { UserAppsModule } from './userapps/userapps.module';
import { AppStatsModule } from './app-stats/app-stats.module';

@Module({
  imports: [UsersModule, AppsModule, UserAppsModule, AppStatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

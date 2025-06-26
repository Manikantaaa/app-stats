import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  const userService = app.get(UsersService);
  await userService.seedRolesIfNotExists();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import * as dotenv from 'dotenv';  // 👈 This must be FIRST
dotenv.config();   
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectMongoDB } from './database/mongo.connection';
import mongoose from 'mongoose';

async function bootstrap() {
      const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in .env');
  }
  await mongoose.connect(mongoUri);

  const app = await NestFactory.create(AppModule);

   app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
 
  await app.listen(process.env.PORT ?? 3000);
  console.log(`✅ Server running on port ${process.env.PORT ?? 3000}`)
}
bootstrap();

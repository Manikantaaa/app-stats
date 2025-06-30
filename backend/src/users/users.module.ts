import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import userSchema from '../models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
  ],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}

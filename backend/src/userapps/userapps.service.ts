import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserAppDto } from './dto/create-user-app.dto';
import { UpdateUserAppDto } from './dto/update-user-app.dto';

@Injectable()
export class UserAppsService {
  constructor(
    @InjectModel('UserApp') private userAppModel: Model<any>,
    @InjectModel('App') private appModel: Model<any>
  ) {}

  async findAll() {
    return this.userAppModel.find()
      .populate('ua_u_id', 'u_firstname u_lastname u_email') // populate user info
      .populate('ua_app_id', 'app_name') // populate app info
      .sort({ ua_created_at: -1 });
  }

  async findVisible() {
    return this.appModel.find({ app_status: 1 }).sort({ app_name: 1 });
  }

  async create({ userId, appIds }: CreateUserAppDto) {
    // Remove old associations
    await this.userAppModel.deleteMany({ ua_u_id: userId });

    // Add new associations
    const creations = appIds.map(appId => ({
      ua_u_id: userId,
      ua_app_id: appId,
      ua_status: 1,
    }));

    return this.userAppModel.insertMany(creations);
  }

  async update(userId: string, { appIds }: UpdateUserAppDto) {
    if (!appIds || !Array.isArray(appIds)) return;

    const currentAssignments = await this.userAppModel.find({ ua_u_id: userId }).select('ua_app_id');
    const currentAppIds = currentAssignments.map(doc => doc.ua_app_id.toString());

    const appsToAdd = appIds.filter(id => !currentAppIds.includes(id));
    const appsToRemove = currentAppIds.filter(id => !appIds.includes(id));

    if (appsToAdd.length > 0) {
      const creations = appsToAdd.map(appId => ({
        ua_u_id: userId,
        ua_app_id: appId,
        ua_status: 1,
      }));
      await this.userAppModel.insertMany(creations);
    }

    if (appsToRemove.length > 0) {
      await this.userAppModel.deleteMany({
        ua_u_id: userId,
        ua_app_id: { $in: appsToRemove },
      });
    }

    return { message: 'User apps updated successfully' };
  }

  // Optional soft delete
  // async remove(id: string) {
  //   return this.userAppModel.findByIdAndDelete(id);
  // }
}

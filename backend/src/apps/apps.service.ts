import { Injectable } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { App } from './schemas/app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppsService {
  constructor(
    @InjectModel(App.name) private App: Model<App>,
  ) {}

  async findAll() {
    return await this.App.find({ app_status: { $ne: 2 } }).sort({ app_created_at: -1 });
  }

  async createApp(data: CreateAppDto) {
    const newApp = new this.App({
      app_name: data.app_name,
      app_status: data.app_status, 
    });
    return await newApp.save();
  }

  async updateApp(id: string, data: UpdateAppDto) {
    return await this.App.findByIdAndUpdate(
      id,
      { app_name: data.app_name },
      { new: true }
    );
  }

  async toggleAppStatus(id: string, status: number) {
    return await this.App.findByIdAndUpdate(id, { app_status: status }, { new: true });
  }

  async deleteApp(id: string) {
    return await this.App.findByIdAndUpdate(id, { app_status: 2 }, { new: true });
  }
}
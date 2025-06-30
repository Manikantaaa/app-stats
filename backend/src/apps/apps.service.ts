import { Injectable } from '@nestjs/common';
import App from '../models/app.schema'; // import the Mongoose model

@Injectable()
export class AppsService {
  async findAll() {
    return await App.find({ app_status: { $ne: 2 } }).sort({ app_created_at: -1 });
  }

  async createApp(data: { app_name: string }) {
    const newApp = new App({
      app_name: data.app_name,
      app_status: 1,
    });
    return await newApp.save();
  }

  async updateApp(id: string, data: { app_name: string }) {
    return await App.findByIdAndUpdate(id, {
      app_name: data.app_name,
    }, { new: true });
  }

  async toggleAppStatus(id: string, status: number) {
    return await App.findByIdAndUpdate(id, { app_status: status }, { new: true });
  }

  async deleteApp(id: string) {
    return await App.findByIdAndUpdate(id, { app_status: 2 }, { new: true });
  }
}

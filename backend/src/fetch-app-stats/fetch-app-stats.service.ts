import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
// import App from '../models/app.schema';
// import AppApi from '../models/appApi.schema';
// import AppStats from '../models/appStats.schema';
// import UserApp from '../models/userApp.schema'; 

import { App } from 'src/apps/schemas/app.schema';
import { AppApi } from 'src/app-api/schemas/app-api.schema';
import { AppStats } from 'src/app-stats/schemas/app-stats.schema';
import { UserApp } from 'src/userapps/schemas/userapp.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class FetchAppStatsService {
  private jwtService: JwtService;

  constructor(
      @InjectModel(App.name) private appModel: Model<App>,
      @InjectModel(AppApi.name) private appApiModel: Model<AppApi>,
      @InjectModel(AppStats.name) private appStatsModel: Model<AppStats>,
      @InjectModel(UserApp.name) private userAppModel: Model<UserApp>,
  ) {
    this.jwtService = new JwtService({
      secret: process.env.EXTERNALAPI_SECRET_KEY,
      signOptions: { algorithm: 'HS256' },
    });
  }

  generateExternalToken(): string {
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
    return this.jwtService.sign({ exp: expirationTime });
  }

  async callExternalApi(): Promise<any> {
    const token = this.generateExternalToken();
    const apiurl = process.env.EXTERNAL_API;
    if (!apiurl) throw new Error('Missing EXTERNAL_API env variable');

    try {
      const response = await axios.post(apiurl, { data: token });
      if (!response.data) throw new Error('Empty data from external API');
      return response.data;
    } catch (err: any) {
      console.error('External API error:', err.response?.data || err.message);
      throw new Error('Failed to fetch app stats data');
    }
  }

  async fetchAndStore(): Promise<void> {
    try {
      const data = await this.callExternalApi();
      if (!data?.detail) throw new Error('Invalid data format from API');

      const { date: dateString, features } = data.detail;
      if (!dateString || !features || typeof features !== 'object')
        throw new Error('Invalid detail in API response');

      const date = new Date(dateString);
      const createdAt = new Date();

      for (const [featureKey, featureApps] of Object.entries(features)) {
        if (!featureApps || typeof featureApps !== 'object') continue;

        const appApi = await this.appApiModel.findOne({
          ai_name: { $regex: new RegExp(`^${featureKey}$`, 'i') },
        });

        if (!appApi) {
          console.warn(`AppApi not found for: ${featureKey}`);
          continue;
        }

        for (const [appName, count] of Object.entries<number>(
          featureApps as Record<string, number>
        )) {
          const app = await this.appModel.findOne({
            app_name: { $regex: new RegExp(`^${appName}$`, 'i') },
          });

          if (!app) {
            console.warn(`App not found: ${appName}`);
            continue;
          }

          const userApp = await this.userAppModel.findOne({
            ua_app_id: app._id,
          });

          if (!userApp) {
            console.warn(`UserApp not found for app_id: ${app._id}`);
            continue;
          }

          await this.appStatsModel.create({
            as_date: date,
            as_ai_id: appApi._id,
            as_ua_id: userApp._id,
            as_count: count,
            as_created_at: createdAt,
            as_updated_at: createdAt,
            as_status: 1,
          });
        }
      }
    } catch (err) {
      console.error('Error in fetchAndStore:', err);
      throw new Error('Failed to fetch and store app stats');
    }
  }
}
